import * as THREE from 'three'
import type { TourHotspot } from './tourData'

/* ------------------------------------------------------------------ *
 * Tunables. Every number the markers are drawn from lives in this
 * block - nothing below this comment should contain a bare literal.
 * ------------------------------------------------------------------ */

/** Assumed height of the viewer's eye above the floor, in metres. */
export const EYE_HEIGHT_M = 1.6

/**
 * A hotspot at or above the horizon implies an infinite floor distance, so the
 * downward angle is never allowed below this.
 */
const MIN_DOWN_ANGLE_DEG = 2
/** Floor distances are clamped into this band - see distanceForPitch(). */
const DIST_MIN_M = 2
const DIST_MAX_M = 6

/** Distance at which a ring is drawn at true world size. */
const REF_DIST_M = 4
/** 1 = no perspective compensation, 0 = full. See scaleForDistance(). */
const SCALE_EXP = 0.65

const CORE_INNER_M = 0.22
const CORE_OUTER_M = 0.34
const HALO_INNER_M = 0.54
const HALO_OUTER_M = 0.6
const HIT_RADIUS_M = 0.75
const RING_SEGMENTS = 64

const CORE_OPACITY_REST = 0.75
const CORE_OPACITY_HOVER = 1
const CORE_HOVER_SCALE = 1.18
const HALO_OPACITY_REST = 0
const HALO_OPACITY_HOVER = 1

/** The ghost ring that tracks the pointer across the floor. */
const CURSOR_SIZE_FACTOR = 0.9
const CURSOR_OPACITY = 0.4
/**
 * The ghost ring never goes further out than a marker could. The floor plane is
 * infinite but a room is not: let it run towards the horizon and in a lift
 * lobby it lands several metres past the lift doors, where it draws on the
 * doors instead of on any floor. Beyond this it simply hides - you cannot walk
 * there either.
 */
const CURSOR_MAX_DIST_M = DIST_MAX_M

/** Hover ease, per millisecond. Time-based so it is frame-rate independent. */
const HOVER_LERP_PER_MS = 0.012

/** Above the panorama sphere (renderOrder 0) and anything else in the scene. */
const MARKER_RENDER_ORDER = 10

const RING_COLOR = 0xffffff

const DEG = Math.PI / 180

/* ------------------------------------------------------------------ */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * The tour's one yaw convention: degrees, 0 looking down -Z, increasing to the
 * right. The camera in panoViewer.ts is aimed with this same function, which is
 * the whole point of there being exactly one of it - two conventions that
 * disagree by a sign put every marker behind the viewer.
 */
export function heading(yawDeg: number, out = new THREE.Vector3()): THREE.Vector3 {
  const y = yawDeg * DEG
  return out.set(Math.sin(y), 0, -Math.cos(y))
}

/** How far across the floor a hotspot's downward angle puts it. */
export function distanceForPitch(pitchDeg: number): number {
  const down = Math.max(MIN_DOWN_ANGLE_DEG, -pitchDeg) * DEG
  return clamp(EYE_HEIGHT_M / Math.tan(down), DIST_MIN_M, DIST_MAX_M)
}

/**
 * Part-way back towards true size. Full perspective shrinks the far rings out
 * of sight and out of the pointer's reach; none at all kills the depth cue that
 * is the entire point.
 */
export function scaleForDistance(d: number): number {
  return Math.pow(d / REF_DIST_M, SCALE_EXP)
}

/**
 * Rings are real meshes lying in the floor plane - never sprites, never
 * billboards. Perspective squashes them into ellipses and shrinks them with
 * distance on its own, which is what makes a set of destinations read as a
 * trail across a floor rather than a row of stickers on a photograph.
 */
function flatRingMaterial(opacity: number) {
  return new THREE.MeshBasicMaterial({
    color: RING_COLOR,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    // The panorama sphere carries no meaningful depth, so a depth-tested ring
    // sitting "inside" it simply vanishes - which looks like the markers never
    // being created and sends you debugging the wrong file.
    depthTest: false,
    depthWrite: false,
  })
}

function flatRing(inner: number, outer: number, opacity: number) {
  // Ring geometry is born standing up in the XY plane; lay it down.
  const geo = new THREE.RingGeometry(inner, outer, RING_SEGMENTS)
  geo.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geo, flatRingMaterial(opacity))
  mesh.renderOrder = MARKER_RENDER_ORDER
  return mesh
}

interface Marker {
  spec: TourHotspot
  group: THREE.Group
  core: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>
  halo: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>
  hit: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>
  distance: number
  hover: number
}

export interface MarkerScreenPosition {
  label: string
  next: string
  /** Distance across the floor, metres. */
  distance: number
  /** Pixels, origin top-left of the canvas. */
  x: number
  y: number
  /** The ring's drawn width on screen, in pixels. */
  widthPx: number
  /**
   * The ring's drawn depth (its across-the-floor axis) on screen, in pixels.
   * A camera-facing marker keeps this equal to widthPx wherever it is; a ring
   * lying in the floor plane gets it squashed by perspective. This is the
   * number that catches a regression back to billboards.
   */
  depthPx: number
  /**
   * Screen y of the top of the marker, halo included. Use this, never the
   * centre, to place anything that must sit clear of the ring.
   */
  topPx: number
  /** depthPx / widthPx. 1 means a circle, below 1 means an ellipse. */
  ellipseRatio: number
  /** false when the marker is behind the camera or off-frame. */
  onScreen: boolean
}

export class FloorMarkers {
  readonly group = new THREE.Group()

  private markers: Marker[] = []
  private cursor: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>
  private hoveredIndex = -1
  private raycaster = new THREE.Raycaster()
  private floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), EYE_HEIGHT_M)
  private scratch = new THREE.Vector3()

  constructor() {
    this.group.renderOrder = MARKER_RENDER_ORDER
    this.cursor = flatRing(
      CORE_INNER_M * CURSOR_SIZE_FACTOR,
      CORE_OUTER_M * CURSOR_SIZE_FACTOR,
      CURSOR_OPACITY,
    )
    this.cursor.visible = false
    this.group.add(this.cursor)
  }

  /**
   * `yawOffsetDeg` is how far the scene's panorama has been rotated to line up
   * with where the camera already points - see sceneYawOffsetDeg in the viewer.
   * The markers have to take the same turn or they part company with the floor
   * they are supposed to be lying on.
   */
  setMarkers(specs: TourHotspot[], yawOffsetDeg = 0) {
    this.clearMarkers()
    for (const spec of specs) {
      const distance = distanceForPitch(spec.pitch)
      const dir = heading(spec.yaw + yawOffsetDeg, this.scratch)

      const group = new THREE.Group()
      group.position.set(dir.x * distance, -EYE_HEIGHT_M, dir.z * distance)
      group.scale.setScalar(scaleForDistance(distance))
      group.renderOrder = MARKER_RENDER_ORDER

      const core = flatRing(CORE_INNER_M, CORE_OUTER_M, CORE_OPACITY_REST)
      const halo = flatRing(HALO_INNER_M, HALO_OUTER_M, HALO_OPACITY_REST)

      // A ring 6 m out is a few pixels tall. Without a generous separate hit
      // target it is effectively unclickable, and the far one is the first
      // thing people reach for.
      const hitGeo = new THREE.CircleGeometry(HIT_RADIUS_M, RING_SEGMENTS)
      hitGeo.rotateX(-Math.PI / 2)
      const hit = new THREE.Mesh(
        hitGeo,
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      )
      hit.renderOrder = MARKER_RENDER_ORDER

      group.add(core, halo, hit)
      this.group.add(group)
      this.markers.push({ spec, group, core, halo, hit, distance, hover: 0 })
    }
    this.hoveredIndex = -1
  }

  /** Whether the pointer's ghost ring is currently on the floor. Test surface. */
  get cursorVisible() {
    return this.cursor.visible
  }

  get hovered(): TourHotspot | null {
    return this.markers[this.hoveredIndex]?.spec ?? null
  }

  setVisible(visible: boolean) {
    this.group.visible = visible
    if (!visible) {
      this.hoveredIndex = -1
      this.cursor.visible = false
    }
  }

  /**
   * Raycast the pointer against the hit discs, then against the floor plane for
   * the ghost ring. `ndc` is the pointer in normalised device coordinates.
   */
  pick(ndc: THREE.Vector2, camera: THREE.Camera) {
    if (!this.group.visible) return
    // World matrices are otherwise only refreshed by a render, so a pick that
    // lands between setMarkers() and the next frame would test every hit disc
    // at the origin and quietly miss all of them.
    this.group.updateMatrixWorld(true)
    camera.updateMatrixWorld()
    this.raycaster.setFromCamera(ndc, camera)

    const hits = this.raycaster.intersectObjects(
      this.markers.map((m) => m.hit),
      false,
    )
    this.hoveredIndex = hits.length
      ? this.markers.findIndex((m) => m.hit === hits[0].object)
      : -1

    // The ghost ring says the floor is walkable before the pointer has found a
    // marker, so it stands down as soon as one is hovered.
    if (this.hoveredIndex !== -1) {
      this.cursor.visible = false
      return
    }
    const point = this.raycaster.ray.intersectPlane(this.floorPlane, this.scratch)
    if (!point || Math.hypot(point.x, point.z) > CURSOR_MAX_DIST_M) {
      this.cursor.visible = false
      return
    }
    const d = Math.hypot(point.x, point.z)
    this.cursor.position.copy(point)
    this.cursor.scale.setScalar(scaleForDistance(Math.max(d, DIST_MIN_M)))
    this.cursor.visible = true
  }

  /** Eases hover states. `dtMs` is real elapsed time, not a frame count. */
  update(dtMs: number) {
    const k = 1 - Math.pow(1 - HOVER_LERP_PER_MS, dtMs)
    for (let i = 0; i < this.markers.length; i++) {
      const m = this.markers[i]
      const target = i === this.hoveredIndex ? 1 : 0
      m.hover += (target - m.hover) * k
      m.core.material.opacity =
        CORE_OPACITY_REST + (CORE_OPACITY_HOVER - CORE_OPACITY_REST) * m.hover
      m.core.scale.setScalar(1 + (CORE_HOVER_SCALE - 1) * m.hover)
      m.halo.material.opacity =
        HALO_OPACITY_REST + (HALO_OPACITY_HOVER - HALO_OPACITY_REST) * m.hover
    }
  }

  /**
   * Where each marker currently lands on screen. Exposed for the hover label
   * and for tests: a marker count alone cannot tell a floor ring from a
   * camera-facing one, but a set of screen positions can.
   */
  screenPositions(
    camera: THREE.Camera,
    width: number,
    height: number,
  ): MarkerScreenPosition[] {
    const eye = camera.position
    const toPixels = (v: THREE.Vector3) => {
      const p = v.clone().project(camera)
      return { x: (p.x * 0.5 + 0.5) * width, y: (-p.y * 0.5 + 0.5) * height, z: p.z }
    }

    return this.markers.map((m) => {
      const diameter = CORE_OUTER_M * m.group.scale.x * 2
      const centre = toPixels(m.group.position)
      // A floor ring's two axes are the line of sight to it flattened into the
      // floor, and the horizontal perpendicular to that. Those are its major
      // and minor axes on screen, which is what makes the squash measurable.
      const depthAxis = m.group.position.clone().sub(eye).setY(0).normalize()
      const widthAxis = new THREE.Vector3(-depthAxis.z, 0, depthAxis.x)
      const side = toPixels(
        m.group.position.clone().addScaledVector(widthAxis, diameter),
      )
      const far = toPixels(
        m.group.position.clone().addScaledVector(depthAxis, diameter),
      )
      const widthPx = Math.hypot(side.x - centre.x, side.y - centre.y)
      const depthPx = Math.hypot(far.x - centre.x, far.y - centre.y)
      // The far edge of the halo - the outermost ring, at its hovered size -
      // measured on screen. Anything that wants to sit above a marker has to
      // clear this, and it grows as the marker gets nearer; a fixed offset put
      // the hover label straight through the middle of a close ring.
      const haloEdge = toPixels(
        m.group.position
          .clone()
          .addScaledVector(depthAxis, HALO_OUTER_M * m.group.scale.x),
      )
      return {
        label: m.spec.label,
        next: m.spec.next,
        distance: m.distance,
        x: centre.x,
        y: centre.y,
        widthPx,
        depthPx,
        topPx: Math.min(centre.y, haloEdge.y),
        ellipseRatio: widthPx ? depthPx / widthPx : 0,
        onScreen:
          centre.z < 1 &&
          centre.x >= 0 &&
          centre.x <= width &&
          centre.y >= 0 &&
          centre.y <= height,
      }
    })
  }

  private clearMarkers() {
    for (const m of this.markers) {
      this.group.remove(m.group)
      for (const mesh of [m.core, m.halo, m.hit]) {
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
    }
    this.markers = []
  }

  dispose() {
    this.clearMarkers()
    this.cursor.geometry.dispose()
    this.cursor.material.dispose()
  }
}
