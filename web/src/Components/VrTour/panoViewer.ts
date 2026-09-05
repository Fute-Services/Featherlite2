import * as THREE from 'three'
import { FloorMarkers, heading, type MarkerScreenPosition } from './floorMarkers'
import { scenes, type TourHotspot } from './tourData'
import type { DecodeRequest, DecodeResponse } from './panoDecoder.worker'

/* ------------------------------------------------------------------ *
 * Viewer tunables.
 * ------------------------------------------------------------------ */

const SPHERE_RADIUS = 500
const SPHERE_WIDTH_SEGMENTS = 60
const SPHERE_HEIGHT_SEGMENTS = 40

/**
 * Width the panoramas are resized to before they reach the GPU. The source
 * files are 12000x6000; see loadTexture() for why that number cannot go
 * straight to a texture. At 4096 a 120-degree view is close to 1:1 on a
 * 1500px-wide screen - zooming right in softens a little, which is the trade.
 */
const PANO_TEXTURE_WIDTH = 4096
/** Decoded panoramas kept around so walking back is instant. */
const TEXTURE_CACHE_SIZE = 5
/** Fallback pacing for preloads when requestIdleCallback is missing. */
const PRELOAD_DELAY_MS = 1200

/**
 * An equirectangular panorama's centre column must land at yaw 0, because that
 * is what every yaw in tourData.ts was authored against. With the geometry
 * mirrored for inside-out viewing, the centre column faces -X, so it needs a
 * quarter turn to reach -Z.
 */
const PANO_YAW_OFFSET = -Math.PI / 2

/**
 * Horizontal field of view. 100 matched the old viewer's config number but not
 * its actual framing - it rendered visibly tighter, and a tight lens also
 * pushes the floor rings towards the bottom edge. 120 restores the openness and
 * brings the rings into shot without tilting the camera down to fetch them.
 */
const DEFAULT_HFOV_DEG = 120
const MIN_HFOV_DEG = 30
const MAX_HFOV_DEG = 130
const ZOOM_STEP_DEG = 10

const MAX_PITCH_DEG = 85

/**
 * Look-around momentum. A drag that stops dead the instant the finger lifts
 * feels mechanical; the view carries on and settles instead.
 */
const DRAG_INERTIA_HALF_LIFE_MS = 120
/** Below this the glide is finished and would only jitter. */
const DRAG_INERTIA_CUTOFF_DEG_PER_S = 1.5
/** How much of each new pointer sample feeds the velocity estimate. */
const DRAG_VELOCITY_BLEND = 0.3
/** A gap longer than this means the drag paused, so the glide starts from rest. */
const MAX_MOVE_GAP_MS = 100
/** How fast the rendered view catches up to the drag target. */
const DRAG_SMOOTH_HALF_LIFE_MS = 40

const AUTOROTATE_DEG_PER_SEC = -2
const AUTOROTATE_IDLE_MS = 5000

/**
 * The whole scene change. Measured off the reference tour: about 200 ms of
 * plain crossfade, with no camera move of any kind. Anything longer stops
 * reading as a move and starts reading as a wait.
 */
const CROSSFADE_MS = 240
/** The arriving sphere sits just inside the outgoing one. */
const INCOMING_SPHERE_SCALE = 0.98
/** Timer cadence that keeps a tween moving when animation frames dry up. */
const TWEEN_FALLBACK_MS = 16

/**
 * How far down a scene is allowed to open. Some interiors declare -25, which
 * framed eye-level arrows and now just points the viewer at their own feet on
 * arrival.
 */
const SCENE_PITCH_LIMIT_DEG = 12

/** A pointer-up counts as a click only inside both of these. */
const CLICK_MAX_MOVE_PX = 6
const CLICK_MAX_MS = 400

/**
 * Gap between the top of a hovered ring and its name. Measured from the halo
 * edge, not the ring centre - a near ring is large on screen, and a fixed
 * offset from the centre printed the label straight across it.
 */
const HOVER_LABEL_GAP_PX = 14

/* ------------------------------------------------------------------ */

const DEG = Math.PI / 180
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export interface PanoViewerCallbacks {
  onSceneChange?: (sceneId: string) => void
}

export class PanoViewer {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private markers = new FloorMarkers()

  private sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null = null
  private textureCache = new Map<string, THREE.Texture>()
  private texturesInFlight = new Map<string, Promise<THREE.Texture>>()
  private currentPanorama = ''
  /**
   * How far the current panorama is rotated from its authored orientation. Set
   * on arrival so a new scene lines up with wherever the viewer is already
   * looking, which is what lets the camera stay still through a scene change.
   * Applied to the sphere and to every marker, so the two stay consistent.
   */
  private sceneYawOffsetDeg = 0
  private decoder: Worker | null = null
  private decodeJobId = 0
  private decodeJobs = new Map<
    number,
    { resolve: (b: ImageBitmap) => void; reject: (e: Error) => void }
  >()
  private yawVelDegPerS = 0
  private pitchVelDegPerS = 0
  private lastMoveAt = 0

  private yawDeg = 0
  private pitchDeg = 0
  // Where the drag wants the camera. yawDeg/pitchDeg chase this every frame
  // instead of jumping straight to it - raw pointermove deltas land at
  // whatever cadence the OS/browser feels like, and rendering them the instant
  // they arrive reads as jitter rather than a smooth pan.
  private targetYawDeg = 0
  private targetPitchDeg = 0
  private hfovDeg = DEFAULT_HFOV_DEG

  private sceneId = ''
  private transitioning = false

  private pointerNdc = new THREE.Vector2(-2, -2)
  private pointerOnCanvas = false
  private dragging = false
  private downX = 0
  private downY = 0
  private downAt = 0
  private movedPx = 0
  private lastX = 0
  private lastY = 0
  private lastInteractionAt = 0

  private frame = 0
  private lastFrameAt = 0
  private disposed = false
  private lastEmittedLabel: string | null = null
  private label: HTMLDivElement
  /** One floating teal pin per marker, rebuilt whenever setMarkers() runs. */
  private pinBadges: HTMLDivElement[] = []
  private badgeHotspots: TourHotspot[] = []
  /** Index into badgeHotspots/pinBadges while the pointer is over a badge itself. */
  private badgeHoverIndex = -1

  private container: HTMLElement
  private callbacks: PanoViewerCallbacks

  constructor(container: HTMLElement, callbacks: PanoViewerCallbacks = {}) {
    this.container = container
    this.callbacks = callbacks
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.touchAction = 'none'
    container.appendChild(this.renderer.domElement)

    this.label = document.createElement('div')
    this.label.className = 'vr-marker-label'
    this.label.style.cssText = [
      'position:absolute',
      'display:none',
      'transform:translate(calc(-50% - 24px),-100%)',
      'pointer-events:none',
      'white-space:nowrap',
      'color:#fff',
      'font:600 14px system-ui,-apple-system,sans-serif',
      'padding:4px 10px',
      'border-radius:9999px',
      'background:rgba(0,0,0,0.62)',
      'backdrop-filter:blur(4px)',
      'border:1px solid rgba(255,255,255,0.14)',
      'z-index:40',
    ].join(';')
    container.appendChild(this.label)


    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      SPHERE_RADIUS * 2,
    )
    this.applyHfov()

    this.scene.add(this.markers.group)

    this.bindPointer()
    window.addEventListener('resize', this.onResize)

    this.lastFrameAt = performance.now()
    this.lastInteractionAt = this.lastFrameAt
    this.frame = requestAnimationFrame(this.tick)
  }

  /* ------------------------------ scenes ------------------------------ */

  async load(sceneId: string) {
    const def = scenes[sceneId]
    if (!def) return
    const texture = await this.loadTexture(def.panorama)
    if (this.disposed) return

    this.renderer.initTexture(texture)
    this.sceneId = sceneId
    this.currentPanorama = def.panorama
    this.applySceneFraming(sceneId)
    this.sphere = this.addSphere(texture, 1)
    this.markers.setMarkers(def.hotspots, this.sceneYawOffsetDeg)
    this.syncPinBadges(def.hotspots)
    this.markers.setVisible(true)
    this.callbacks.onSceneChange?.(sceneId)
    this.preloadNeighbours(sceneId)
  }

  /**
   * Move to another scene: one short crossfade, and nothing else.
   *
   * The camera does not turn, does not zoom and does not tilt. Everything the
   * viewer is looking at stays exactly where it is while the new place fades in
   * over the old one. Turning to face the marker first, pushing the lens in to
   * fake a step forward, opening back out on arrival - all of that was tried,
   * and all of it reads as the tour lurching about. A plain dissolve reads as
   * moving.
   *
   * The new scene's own framing is honoured by rotating the panorama and its
   * markers under the camera instead of swinging the camera round to meet them
   * - see sceneYawOffset.
   */
  async goTo(sceneId: string, _from?: TourHotspot) {
    const def = scenes[sceneId]
    if (!def || this.transitioning) return
    this.transitioning = true
    this.markers.setVisible(false)
    this.lastEmittedLabel = null
    this.label.style.display = 'none'

    let texture: THREE.Texture
    try {
      texture = await this.loadTexture(def.panorama)
    } catch {
      // The panorama never arrived; stay where we are rather than dissolving
      // into nothing, and give the markers back.
      this.transitioning = false
      this.markers.setVisible(true)
      return
    }
    if (this.disposed) return

    // Push the texture to the GPU before the fade starts. Uploading is the most
    // expensive thing a scene change does, and doing it on the fade's first
    // frame is what made the fade stutter.
    this.renderer.initTexture(texture)
    if (this.disposed) return

    // Line the new panorama up with where the viewer is already looking, so the
    // camera has no reason to move.
    this.sceneYawOffsetDeg = this.yawDeg - (def.yaw ?? 0)
    const incoming = this.addSphere(texture, 0)
    const outgoing = this.sphere
    this.sphere = incoming

    this.sceneId = sceneId
    this.currentPanorama = def.panorama
    this.markers.setMarkers(def.hotspots, this.sceneYawOffsetDeg)
    this.syncPinBadges(def.hotspots)
    this.callbacks.onSceneChange?.(sceneId)

    // Yaw stays put - swinging it is what made this lurch, and the panorama has
    // already been turned to meet it. Pitch is different: it is at most a dozen
    // degrees, and without it a near ring in a small room lands off the bottom
    // of the frame. Eased over the same fade, it is not something you notice.
    const startPitch = this.pitchDeg
    const targetPitch = Math.max(def.pitch ?? 0, -SCENE_PITCH_LIMIT_DEG)

    await this.tween(CROSSFADE_MS, (t) => {
      incoming.material.opacity = t
      this.pitchDeg = startPitch + (targetPitch - startPitch) * t
    })
    if (this.disposed) return

    incoming.material.transparent = false
    incoming.material.opacity = 1
    if (outgoing) this.disposeSphere(outgoing)

    this.transitioning = false
    this.markers.setVisible(true)
    this.preloadNeighbours(sceneId)
  }

  /**
   * Only the very first scene positions the camera; after that a scene is
   * rotated to meet the camera instead - see sceneYawOffsetDeg.
   */
  private applySceneFraming(sceneId: string) {
    const def = scenes[sceneId]
    this.sceneYawOffsetDeg = 0
    this.yawDeg = def.yaw ?? 0
    this.pitchDeg = Math.max(def.pitch ?? 0, -SCENE_PITCH_LIMIT_DEG)
  }

  /**
   * The panoramas ship at 12000x6000. Handed to the GPU at that size, one costs
   * 275 MB of texture memory and blocks the main thread for about 1.5 seconds
   * while it uploads - measured, and the whole reason a scene change used to
   * jam. Fetched, decoded and resized to PANO_TEXTURE_WIDTH in a worker (see
   * decodeInWorker) the main thread is left with only the upload, about 35 ms.
   *
   * This is a runtime rescue for oversized source images, not a substitute for
   * exporting them at a sane size: the 12-18 MB download per scene is still
   * there, and that is a build-time fix.
   */
  private loadTexture(url: string): Promise<THREE.Texture> {
    const cached = this.textureCache.get(url)
    if (cached) {
      // Refresh its place in the eviction order.
      this.textureCache.delete(url)
      this.textureCache.set(url, cached)
      return Promise.resolve(cached)
    }
    const inFlight = this.texturesInFlight.get(url)
    if (inFlight) return inFlight

    const job = this.decodeTexture(url)
      .then((texture) => {
        this.texturesInFlight.delete(url)
        this.cacheTexture(url, texture)
        return texture
      })
      .catch((err) => {
        this.texturesInFlight.delete(url)
        throw err
      })
    this.texturesInFlight.set(url, job)
    return job
  }

  private async decodeTexture(url: string): Promise<THREE.Texture> {
    const source = await this.decodeInWorker(url).catch(() => this.decodeOnMainThread(url))
    const texture = new THREE.Texture(source)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    // A panorama is sampled at roughly 1:1 on screen, so mipmaps buy nothing
    // and cost a third again in memory plus the time to build them.
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true
    return texture
  }

  /**
   * The worker owns the fetch, the decode and the resize, and transfers the
   * finished bitmap back. Doing the same work here costs about 190 ms of
   * blocked main thread per panorama - createImageBitmap is asynchronous but
   * not free - which is a visible hitch on every scene change and on every
   * idle preload.
   */
  private decodeInWorker(url: string): Promise<ImageBitmap> {
    if (!this.decoder) {
      this.decoder = new Worker(new URL('./panoDecoder.worker.ts', import.meta.url), {
        type: 'module',
      })
      this.decoder.onmessage = (event: MessageEvent<DecodeResponse>) => {
        const { id, bitmap, error } = event.data
        const pending = this.decodeJobs.get(id)
        if (!pending) return
        this.decodeJobs.delete(id)
        if (bitmap) pending.resolve(bitmap)
        else pending.reject(new Error(error ?? 'panorama decode failed'))
      }
      this.decoder.onerror = () => {
        // The worker is gone; everything waiting falls back to the main thread.
        for (const pending of this.decodeJobs.values()) {
          pending.reject(new Error('panorama decoder worker failed'))
        }
        this.decodeJobs.clear()
        this.decoder?.terminate()
        this.decoder = null
      }
    }

    const id = ++this.decodeJobId
    const worker = this.decoder
    return new Promise<ImageBitmap>((resolve, reject) => {
      this.decodeJobs.set(id, { resolve, reject })
      worker.postMessage({ id, url, width: PANO_TEXTURE_WIDTH } satisfies DecodeRequest)
    })
  }

  /** Used only when the worker is unavailable or has failed. */
  private async decodeOnMainThread(url: string): Promise<ImageBitmap> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`panorama ${url}: ${response.status}`)
    const blob = await response.blob()
    try {
      return await createImageBitmap(blob, {
        resizeWidth: PANO_TEXTURE_WIDTH,
        resizeHeight: PANO_TEXTURE_WIDTH / 2,
        resizeQuality: 'medium',
        imageOrientation: 'flipY',
      })
    } catch {
      return await createImageBitmap(blob, { imageOrientation: 'flipY' })
    }
  }

  private cacheTexture(url: string, texture: THREE.Texture) {
    this.textureCache.set(url, texture)
    while (this.textureCache.size > TEXTURE_CACHE_SIZE) {
      const oldest = this.textureCache.keys().next().value as string
      if (oldest === this.currentPanorama) break
      const evicted = this.textureCache.get(oldest)
      this.textureCache.delete(oldest)
      if (evicted !== this.sphere?.material.map) evicted?.dispose()
    }
  }

  /**
   * Warm the panoramas one click away while nothing else is happening, so a
   * walk starts on a texture that is already decoded rather than on a fetch.
   */
  private preloadNeighbours(sceneId: string) {
    const targets = (scenes[sceneId]?.hotspots ?? [])
      .map((h) => scenes[h.next]?.panorama)
      .filter((p): p is string => !!p && !this.textureCache.has(p))
    if (!targets.length) return

    const next = () => {
      const url = targets.shift()
      if (!url || this.disposed) return
      // One at a time: these are large files, and racing them would compete
      // with whatever the viewer is doing now.
      this.loadTexture(url)
        .then(() => this.whenIdle(next))
        .catch(() => this.whenIdle(next))
    }
    this.whenIdle(next)
  }

  private whenIdle(fn: () => void) {
    const ric = (window as { requestIdleCallback?: (cb: () => void) => void })
      .requestIdleCallback
    if (ric) ric(fn)
    else setTimeout(fn, PRELOAD_DELAY_MS)
  }

  private addSphere(texture: THREE.Texture, opacity: number) {
    const geo = new THREE.SphereGeometry(
      SPHERE_RADIUS,
      SPHERE_WIDTH_SEGMENTS,
      SPHERE_HEIGHT_SEGMENTS,
    )
    // Mirrored so the texture is seen from the inside, then turned so the
    // image's centre column sits at yaw 0.
    geo.scale(-1, 1, 1)
    // Plus however far this scene is turned to meet the camera. Yaw grows to
    // the right while three rotates the other way about Y, hence the sign.
    geo.rotateY(PANO_YAW_OFFSET - this.sceneYawOffsetDeg * DEG)

    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: opacity < 1,
        opacity,
        depthWrite: false,
      }),
    )
    // The arriving panorama sits just inside the outgoing one and draws after
    // it, so the dissolve has a stable order instead of z-fighting.
    mesh.scale.setScalar(opacity < 1 ? INCOMING_SPHERE_SCALE : 1)
    mesh.renderOrder = opacity < 1 ? 1 : 0
    this.scene.add(mesh)
    return mesh
  }

  private disposeSphere(mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>) {
    this.scene.remove(mesh)
    mesh.geometry.dispose()
    mesh.material.dispose()
    // The texture itself belongs to the cache, not to the sphere - a scene the
    // viewer walks back into should not have to decode again.
  }

  private tween(durationMs: number, step: (t: number) => void) {
    return new Promise<void>((resolve) => {
      const start = performance.now()
      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        clearInterval(timer)
        resolve()
      }
      const run = () => {
        if (finished) return
        if (this.disposed) return finish()
        const t = Math.min((performance.now() - start) / durationMs, 1)
        step(t)
        if (t >= 1) finish()
      }
      const rafLoop = () => {
        run()
        if (!finished) requestAnimationFrame(rafLoop)
      }
      // A background tab gets no animation frames, and a walk driven only by
      // them stalls halfway: the markers stay hidden and `transitioning` never
      // clears, so switching away mid-walk and back left a dead tour. Timers
      // keep running, so this one carries the tween whenever frames dry up.
      // While the tab is visible it never wins the race against rAF.
      const timer = setInterval(run, TWEEN_FALLBACK_MS)
      requestAnimationFrame(rafLoop)
    })
  }

  /* ------------------------------ camera ------------------------------ */

  /**
   * Point the camera at the stored angles and refresh its matrices. Anything
   * that projects or raycasts has to call this first rather than assume a frame
   * has just rendered - a background tab renders none, and marker positions read
   * against stale matrices come back as nonsense rather than as an error.
   */
  private syncCamera() {
    this.camera.rotation.set(this.pitchDeg * DEG, -this.yawDeg * DEG, 0, 'YXZ')
    this.camera.updateMatrixWorld()
  }

  private applyHfov() {
    const aspect = this.camera.aspect || 1
    const vFov = 2 * Math.atan(Math.tan((this.hfovDeg * DEG) / 2) / aspect)
    this.camera.fov = vFov / DEG
    this.camera.updateProjectionMatrix()
  }

  zoomIn() {
    this.hfovDeg = clamp(this.hfovDeg - ZOOM_STEP_DEG, MIN_HFOV_DEG, MAX_HFOV_DEG)
    this.applyHfov()
    this.lastInteractionAt = performance.now()
  }

  zoomOut() {
    this.hfovDeg = clamp(this.hfovDeg + ZOOM_STEP_DEG, MIN_HFOV_DEG, MAX_HFOV_DEG)
    this.applyHfov()
    this.lastInteractionAt = performance.now()
  }

  /* ------------------------------ pointer ------------------------------ */

  private bindPointer() {
    const el = this.renderer.domElement
    el.style.cursor = 'grab'
    el.addEventListener('pointerdown', this.onPointerDown)
    el.addEventListener('pointerleave', this.onPointerLeave)
    el.addEventListener('wheel', this.onWheel, { passive: false })
    // Move and release go on the window, not the canvas. A drag that leaves the
    // canvas and releases outside it never delivers pointerup to the element,
    // which left the viewer stuck in a drag: the next stray move - even one the
    // browser sends by itself when the tab regains focus - swung the camera by
    // the whole distance the pointer had travelled meanwhile.
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.onPointerUp)
    window.addEventListener('pointercancel', this.onPointerCancel)
  }

  /**
   * A touch tap - and a synthetic click - arrives as pointerdown/pointerup with
   * no pointermove in between, so the pointer position has to be read on the
   * way down as well. Reading it only on move made every ring untappable.
   */
  private setPointerFrom(e: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointerNdc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.pointerOnCanvas = true
    return rect
  }

  private onPointerDown = (e: PointerEvent) => {
    this.setPointerFrom(e)
    this.dragging = true
    this.downX = this.lastX = e.clientX
    this.downY = this.lastY = e.clientY
    this.downAt = performance.now()
    this.movedPx = 0
    // Start the chase from exactly where the view already is, not wherever the
    // last drag's target was left.
    this.targetYawDeg = this.yawDeg
    this.targetPitchDeg = this.pitchDeg
    this.yawVelDegPerS = 0
    this.pitchVelDegPerS = 0
    this.lastMoveAt = this.downAt
    this.lastInteractionAt = this.downAt
    // Capture is a convenience, not a requirement - if the browser refuses it
    // (it throws when the pointer is already gone) the click logic below must
    // still run, so it never gets to abort the handler.
    try {
      this.renderer.domElement.setPointerCapture(e.pointerId)
    } catch {
      /* no capture; drag still tracks via the element's own move events */
    }
    this.renderer.domElement.style.cursor = 'grabbing'
  }

  private onPointerMove = (e: PointerEvent) => {
    // Off-canvas moves only matter while a drag is in flight; otherwise they
    // would keep hovering markers while the pointer is over the site's chrome.
    if (!this.dragging && e.target !== this.renderer.domElement) return
    const rect = this.setPointerFrom(e)
    if (!this.dragging) {
      // Pick here as well as in the frame loop: the ghost ring and the hover
      // state should answer the pointer immediately, not a frame later.
      this.syncCamera()
      this.markers.pick(this.pointerNdc, this.camera)
      this.updateCursorStyle()
      return
    }
    const dx = e.clientX - this.lastX
    const dy = e.clientY - this.lastY
    this.lastX = e.clientX
    this.lastY = e.clientY
    this.movedPx = Math.max(
      this.movedPx,
      Math.hypot(e.clientX - this.downX, e.clientY - this.downY),
    )

    // Drag one screen width and you turn through one field of view, so the
    // image tracks the pointer at any zoom level.
    //
    // Both axes move the *picture* with the hand, which means the camera turns
    // the opposite way on both. Drag up and the picture comes up, so the camera
    // tilts down. Horizontal already worked this way; vertical did not, and the
    // mismatch is why dragging up sent the view the other way.
    const perPx = this.hfovDeg / rect.width
    const dYaw = -dx * perPx
    const dPitch = dy * perPx
    const before = this.targetPitchDeg
    this.targetYawDeg += dYaw
    this.targetPitchDeg = clamp(this.targetPitchDeg + dPitch, -MAX_PITCH_DEG, MAX_PITCH_DEG)

    // Remember how fast the view was moving, so releasing it glides to a stop.
    // Smoothed, because a single pointer sample is noisy and would fling.
    const now = performance.now()
    const dt = Math.max(now - this.lastMoveAt, 1)
    this.lastMoveAt = now
    if (dt < MAX_MOVE_GAP_MS) {
      const blend = DRAG_VELOCITY_BLEND
      this.yawVelDegPerS += ((dYaw / dt) * 1000 - this.yawVelDegPerS) * blend
      this.pitchVelDegPerS +=
        (((this.targetPitchDeg - before) / dt) * 1000 - this.pitchVelDegPerS) * blend
    } else {
      this.yawVelDegPerS = 0
      this.pitchVelDegPerS = 0
    }
    this.lastInteractionAt = now
  }

  private onPointerUp = (e: PointerEvent) => {
    const wasDragging = this.dragging
    this.dragging = false
    try {
      this.renderer.domElement.releasePointerCapture(e.pointerId)
    } catch {
      /* never captured, or already released */
    }
    this.lastInteractionAt = performance.now()

    if (!wasDragging) return
    // Without this, any look-around drag that happens to end over a marker
    // teleports the viewer somewhere they did not ask to go.
    const isClick =
      this.movedPx < CLICK_MAX_MOVE_PX && performance.now() - this.downAt < CLICK_MAX_MS
    if (!isClick) {
      this.updateCursorStyle()
      return
    }
    this.syncCamera()
    this.markers.pick(this.pointerNdc, this.camera)
    const hit = this.markers.hovered
    if (hit) void this.goTo(hit.next, hit)
  }

  private onPointerCancel = () => {
    this.dragging = false
    this.updateCursorStyle()
  }

  private onPointerLeave = () => {
    this.pointerOnCanvas = false
    this.pointerNdc.set(-2, -2)
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    this.hfovDeg = clamp(
      this.hfovDeg + Math.sign(e.deltaY) * ZOOM_STEP_DEG * 0.5,
      MIN_HFOV_DEG,
      MAX_HFOV_DEG,
    )
    this.applyHfov()
    this.lastInteractionAt = performance.now()
  }

  /**
   * Carry the view on after the finger lifts and decay it to a stop. Returns
   * whether it is still gliding, so autorotate waits its turn instead of
   * fighting it. Half-life based, so the feel does not change with frame rate.
   */
  private applyDragInertia(dtMs: number) {
    if (this.dragging) return false
    if (
      Math.abs(this.yawVelDegPerS) < DRAG_INERTIA_CUTOFF_DEG_PER_S &&
      Math.abs(this.pitchVelDegPerS) < DRAG_INERTIA_CUTOFF_DEG_PER_S
    ) {
      this.yawVelDegPerS = 0
      this.pitchVelDegPerS = 0
      return false
    }
    this.yawDeg += (this.yawVelDegPerS * dtMs) / 1000
    this.pitchDeg = clamp(
      this.pitchDeg + (this.pitchVelDegPerS * dtMs) / 1000,
      -MAX_PITCH_DEG,
      MAX_PITCH_DEG,
    )
    const decay = Math.pow(0.5, dtMs / DRAG_INERTIA_HALF_LIFE_MS)
    this.yawVelDegPerS *= decay
    this.pitchVelDegPerS *= decay
    this.lastInteractionAt = performance.now()
    return true
  }

  private updateCursorStyle() {
    const el = this.renderer.domElement
    el.style.cursor = this.dragging ? 'grabbing' : this.markers.hovered ? 'pointer' : 'grab'
  }

  private onResize = () => {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    if (!w || !h) return
    this.camera.aspect = w / h
    this.applyHfov()
    this.renderer.setSize(w, h)
  }

  /* ------------------------------ frame ------------------------------ */

  private tick = (now: number) => {
    if (this.disposed) return
    const dt = Math.min(now - this.lastFrameAt, 100)
    this.lastFrameAt = now

    if (this.dragging) {
      const chase = 1 - Math.pow(0.5, dt / DRAG_SMOOTH_HALF_LIFE_MS)
      this.yawDeg += (this.targetYawDeg - this.yawDeg) * chase
      this.pitchDeg += (this.targetPitchDeg - this.pitchDeg) * chase
    }

    const gliding = this.applyDragInertia(dt)

    if (
      !this.dragging &&
      !gliding &&
      !this.transitioning &&
      now - this.lastInteractionAt > AUTOROTATE_IDLE_MS
    ) {
      this.yawDeg += (AUTOROTATE_DEG_PER_SEC * dt) / 1000
    }

    this.syncCamera()

    if (this.pointerOnCanvas && !this.dragging) {
      this.markers.pick(this.pointerNdc, this.camera)
      this.updateCursorStyle()
    }
    this.markers.update(dt)
    this.updateHoverLabel()
    if (this.pinBadges.length) {
      this.updatePinBadges(
        this.markers.screenPositions(this.camera, this.container.clientWidth, this.container.clientHeight),
      )
    }

    this.renderer.render(this.scene, this.camera)
    this.frame = requestAnimationFrame(this.tick)
  }

  /**
   * The hovered ring's name rides above it. This is written straight to the DOM
   * rather than through React state: the label has to follow the ring every
   * frame, and pushing that through setState re-rendered the whole page
   * component sixty times a second for one line of text.
   */
  private updateHoverLabel() {
    // The ring's own 3D pick takes priority; the pin badge is a fallback
    // hover source so its name shows even when the pointer never reaches
    // the ring itself (the badge floats well clear of it on screen).
    const ringHovered = this.markers.hovered
    const badgeHovered = this.badgeHoverIndex >= 0 ? this.badgeHotspots[this.badgeHoverIndex] : null
    const hovered = ringHovered ?? badgeHovered
    if (!hovered) {
      if (this.lastEmittedLabel !== null) {
        this.lastEmittedLabel = null
        this.label.style.display = 'none'
      }
      return
    }
    if (this.lastEmittedLabel !== hovered.label) {
      this.lastEmittedLabel = hovered.label
      this.label.textContent = hovered.label
      this.label.style.display = 'block'
    }
    if (!ringHovered && badgeHovered) {
      const badge = this.pinBadges[this.badgeHoverIndex]
      const badgeRect = badge.getBoundingClientRect()
      const containerRect = this.container.getBoundingClientRect()
      this.label.style.left = `${badgeRect.left + badgeRect.width / 2 - containerRect.left}px`
      this.label.style.top = `${badgeRect.top - containerRect.top - HOVER_LABEL_GAP_PX}px`
      return
    }
    const pos = this.markers
      .screenPositions(this.camera, this.container.clientWidth, this.container.clientHeight)
      .find((p) => p.next === hovered.next && p.label === hovered.label)
    if (!pos) return
    this.label.style.left = `${pos.x}px`
    this.label.style.top = `${pos.topPx - HOVER_LABEL_GAP_PX}px`
  }

  /**
   * Rebuilds the floating pin badges to match the current scene's hotspots.
   * Called wherever markers.setMarkers() is - the badges are a second, purely
   * decorative DOM layer above the same floor rings, not something the
   * three.js marker system needs to know about.
   */
  private syncPinBadges(hotspots: TourHotspot[]) {
    for (const badge of this.pinBadges) badge.remove()
    this.badgeHotspots = hotspots
    this.badgeHoverIndex = -1
    this.pinBadges = []
  }

  /** Floats each pin badge above its ring, connected by a stick down to it. */
  private updatePinBadges(positions: MarkerScreenPosition[]) {
    const visible = this.markers.group.visible && !this.transitioning
    for (let i = 0; i < this.pinBadges.length; i++) {
      const badge = this.pinBadges[i]
      const pos = positions[i]
      if (!visible || !pos || !pos.onScreen) {
        badge.style.display = 'none'
        continue
      }
      badge.style.display = 'flex'
      badge.style.left = `${pos.x}px`
      badge.style.top = `${pos.topPx}px`
    }
  }

  /* ------------------------------ misc ------------------------------ */

  get currentScene() {
    return this.sceneId
  }

  /**
   * Where the markers currently are on screen. The tour's tests assert on this
   * rather than on "setMarkers was called": a call count cannot tell a floor
   * ring from a camera-facing one, and a set of screen positions can.
   */
  markerScreenPositions(): MarkerScreenPosition[] {
    this.syncCamera()
    return this.markers.screenPositions(
      this.camera,
      this.container.clientWidth,
      this.container.clientHeight,
    )
  }

  /** Exposed for the same reason - see markerScreenPositions(). */
  get cameraAngles() {
    return { yaw: this.yawDeg, pitch: this.pitchDeg, hfov: this.hfovDeg }
  }

  /** Exposed for the same reason - see markerScreenPositions(). */
  get hoveredLabel(): string | null {
    return this.markers.hovered?.label ?? null
  }

  /** Exposed for the same reason - see markerScreenPositions(). */
  get cursorRingVisible() {
    return this.markers.cursorVisible
  }

  get isTransitioning() {
    return this.transitioning
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frame)
    window.removeEventListener('resize', this.onResize)
    const el = this.renderer.domElement
    el.removeEventListener('pointerdown', this.onPointerDown)
    el.removeEventListener('pointerleave', this.onPointerLeave)
    el.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
    window.removeEventListener('pointercancel', this.onPointerCancel)
    this.label.remove()
    for (const badge of this.pinBadges) badge.remove()
    if (this.sphere) this.disposeSphere(this.sphere)
    this.markers.dispose()
    this.decoder?.terminate()
    this.decoder = null
    this.decodeJobs.clear()
    for (const texture of this.textureCache.values()) texture.dispose()
    this.textureCache.clear()
    this.renderer.dispose()
    el.remove()
  }
}

export { heading }
