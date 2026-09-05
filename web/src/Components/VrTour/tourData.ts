/**
 * Scene graph for the 360 tour.
 *
 * `yaw`/`pitch` on a scene are the camera's opening framing; `yaw`/`pitch` on a
 * hotspot say where the destination is. Both are degrees, yaw increasing to the
 * right, pitch positive up - the same convention `heading()` in floorMarkers.ts
 * uses. Yaw 0 is the centre column of the equirectangular panorama, which is
 * what PANO_YAW_OFFSET in panoViewer.ts lines the sphere up to.
 *
 * HOW THESE NUMBERS WERE AUTHORED. Both fields were re-derived from the
 * panoramas rather than carried over. Each panorama was reprojected to flat
 * views on a 30-degree grid (a feature at column x of a width-W equirect sits at
 * yaw = (x / W - 0.5) * 360), the doorway, driveway, turnstile line or gate
 * opening that actually leads to each destination was located, and the hotspot
 * yaw set to that bearing. The inherited yaws were framing-era guesses and
 * several pointed at scenery: the Entry Gate ring in ext_entry_perspective sat
 * at 335 with the gate arch at 0, the Entry Perspective ring in the arrival
 * plaza sat at -52 with the driveway out at -100, and ext_kids_play_area sent
 * you into its own picket fence at 0 when the walkway back to the gate runs
 * at 90.
 *
 * PITCH IS DISTANCE, so pitch is what stops the rings clustering.
 * distanceForPitch() is 1.6 / tan(-pitch) clamped to 2..6 m, so the whole usable
 * band is -15 (6.0 m, the far clamp) to about -35 (2.3 m); anything shallower
 * than -15 is the same 6 m ring as everything else, which is why the inherited
 * -5s and -8s all landed at one depth in a row. Every pitch below sits inside
 * that band and is ranked against its neighbours in the same scene: a door a few
 * steps away gets -22 to -28, a walk across the plaza gets -15 to -18. Where two
 * destinations genuinely share one exit - the court's fence gate - the yaws stay
 * close and the pitches do the separating, which is what the floor rings are for.
 *
 * A RING HAS TO LAND ON WALKABLE FLOOR. It is a mesh lying in the floor plane,
 * so a yaw and pitch pair that puts it inside a planter, on a lift door, on a
 * fence or past a glass wall reads as a sticker on the scenery rather than a
 * step you can take. Every pair below was rendered at its own bearing and
 * checked against the photograph for that; several were moved for it alone -
 * the arrival plaza's exit ring was on the palm planter, the lift rings were on
 * the door leaves, the court rings were on the mesh, and workstation 2's was on
 * a side lamp. Where clear floor and the true bearing disagree, the ring is
 * nudged along the route, never off it.
 *
 * Opening `yaw` is set per scene to frame the rings it now has rather than the
 * prettiest wall, since a 120-degree lens only shows +/-60 and a ring outside
 * that is a ring nobody finds.
 *
 * A hotspot's pitch is what places its floor ring: the steeper the downward
 * angle, the nearer the ring lands. See distanceForPitch() in floorMarkers.ts.
 */

export interface TourHotspot {
  yaw: number
  pitch: number
  label: string
  next: string
}

export interface TourScene {
  panorama: string
  yaw?: number
  pitch?: number
  hotspots: TourHotspot[]
}

/**
 * Panoramas are served from Cloudflare Images (same CDN the rest of the app
 * already uses), at the `orig` variant to keep the full re-exported quality.
 */
const cf = (slug: string) => `https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/vr/${slug}/orig`

export const FIRST_SCENE = 'ext_entry_gate'

export const vrCategories: Record<string, { id: string; name: string }[]> = {
  Exterior: [
    { id: 'ext_entry_gate', name: 'Entry Gate' },
    { id: 'ext_entry_perspective', name: 'Entry Perspective' },
    { id: 'ext_drop_off_area', name: 'Arrival Plaza' },
    { id: 'ext_kids_play_area', name: 'Kids Play Area' },
    { id: 'ext_open_seating', name: 'Open Seating Area' },
    { id: 'ext_terrace_cafe_1', name: 'Terrace Cafe' },
    { id: 'ext_terrace_cafe_2', name: 'Terrace Cafe' },
    { id: 'ext_multipurpose_court', name: 'Terrace Multipurpose Court' },
  ],
  Interior: [
    { id: 'int_reception_lobby', name: 'Reception Lobby' },
    { id: 'int_lift_lobby', name: 'Lift Lobby' },
    { id: 'int_lift_lobby_2', name: 'Lift Lobby' },
    { id: 'int_gf_cafe_waiting', name: 'GF Cafe & Waiting Area' },
    { id: 'int_workstation_1', name: 'Workstation Area' },
    { id: 'int_workstation_2', name: 'Workstation Area' },
  ],
}

export const scenes: Record<string, TourScene> = {
  ext_entry_gate: {
    panorama: cf('entry-gate'),
    // The boom barrier and the driveway through the arch are dead centre.
    yaw: -10,
    hotspots: [
      { yaw: 0, pitch: -15, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_entry_perspective: {
    panorama: cf('entry-perspective'),
    // Opens on the walk towards the porte-cochere, which is the way on.
    yaw: -50,
    hotspots: [
      // The paved walk between the palms, towards the building canopy.
      { yaw: -95, pitch: -18, label: 'Arrival Plaza', next: 'ext_drop_off_area' },
      // Back out through the arch: the barrier sits at the image centre.
      { yaw: 0, pitch: -15, label: 'Entry Gate', next: 'ext_entry_gate' },
      // The plaza carries on behind the camera, along the building.
      { yaw: 178, pitch: -16, label: 'Kids Play Area', next: 'ext_kids_play_area' },
    ],
  },
  ext_drop_off_area: {
    panorama: cf('drop-off-area'),
    // Frames the entrance doors with the garden lane still in shot.
    yaw: 30,
    hotspots: [
      // The glazed entrance doors, a few steps across the porte-cochere.
      { yaw: 0, pitch: -22, label: 'Reception Lobby', next: 'int_reception_lobby' },
      // The drop-off lane out past the SIGNATURE signage, clear of the palm
      // planter that sits in the middle of it.
      { yaw: -118, pitch: -15, label: 'Entry Perspective', next: 'ext_entry_perspective' },
      // The lane the other way, between the canopy column and the planting.
      { yaw: 70, pitch: -16, label: 'Open Seating Area', next: 'ext_open_seating' },
    ],
  },
  ext_kids_play_area: {
    panorama: cf('kids-play-area'),
    // Frames the play equipment and still keeps the ring at 90 in shot.
    yaw: 45,
    pitch: -15,
    hotspots: [
      // The walkway back towards the gate - the arch is visible down it.
      { yaw: 90, pitch: -15, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_open_seating: {
    panorama: cf('open-seating-area'),
    yaw: -120,
    pitch: -15,
    hotspots: [
      // The plaza ground running out past the lawn, towards the barrier.
      { yaw: -180, pitch: -15, label: 'Arrival Plaza', next: 'ext_drop_off_area' },
    ],
  },
  ext_terrace_cafe_1: {
    panorama: cf('terrace-cafe-1'),
    yaw: -60,
    pitch: -20,
    hotspots: [
      // The tiled walk into the covered dining run, off the cafe chairs.
      { yaw: -85, pitch: -24, label: 'Terrace Cafe', next: 'ext_terrace_cafe_2' },
      // The blank core wall - the way back inside, and close.
      { yaw: -20, pitch: -28, label: 'Lift Lobby', next: 'int_lift_lobby_2' },
    ],
  },
  ext_terrace_cafe_2: {
    panorama: cf('terrace-cafe-2'),
    pitch: -20,
    hotspots: [
      // The covered walk carrying on past the core, towards the court.
      { yaw: 10, pitch: -15, label: 'Terrace Multipurpose Court', next: 'ext_multipurpose_court' },
      // Back out onto the open terrace paving.
      { yaw: -160, pitch: -20, label: 'Terrace Cafe', next: 'ext_terrace_cafe_1' },
    ],
  },
  ext_multipurpose_court: {
    panorama: cf('multipurpose-court'),
    // Faces the one gap in the fence, so both rings are in frame.
    yaw: -115,
    pitch: -10,
    hotspots: [
      // Both destinations leave through the same gate in the mesh, so depth
      // tells them apart. Both sit on the turf inside the fence: 6 m would put
      // them on the mesh itself, which is the one thing a floor ring must
      // never do.
      { yaw: -130, pitch: -18, label: 'Terrace Cafe', next: 'ext_terrace_cafe_2' },
      { yaw: -100, pitch: -24, label: 'Reception', next: 'int_reception_lobby' },
    ],
  },
  int_reception_lobby: {
    panorama: cf('reception-lobby'),
    // Frames the speed gates and the branded lounge wall together.
    yaw: -45,
    pitch: -10,
    hotspots: [
      // The speed gates, and the lift corridor straight through them.
      { yaw: -100, pitch: -24, label: 'Lift Lobby', next: 'int_lift_lobby' },
      // Between the two gold drums: the cafe's own lounge seating is visible
      // through that gap. NOT the branded lounge wall behind the camera - that
      // is the lobby's own waiting seating, not a separate scene.
      { yaw: 5, pitch: -22, label: 'GF Cafe & Waiting Area', next: 'int_gf_cafe_waiting' },
      // Out through the glazed front onto the plaza, lined up with the paved
      // path that runs away outside rather than the blank middle of the
      // glazing. Kept at 3.3 m so the ring stays on marble, not on the glass.
      { yaw: 75, pitch: -26, label: 'Arrival Plaza', next: 'ext_drop_off_area' },
    ],
  },
  int_lift_lobby: {
    panorama: cf('lift-lobby'),
    yaw: 45,
    pitch: -25,
    hotspots: [
      // Back out through the speed gates into the lobby.
      { yaw: 90, pitch: -26, label: 'Reception Lobby', next: 'int_reception_lobby' },
      // Up. At the 2 m floor so the ring lies on the lobby floor in front of
      // the lift bank rather than on the door leaf.
      { yaw: 0, pitch: -39, label: 'Workstation Area', next: 'int_workstation_2' },
    ],
  },
  int_lift_lobby_2: {
    panorama: cf('lift-lobby'),
    yaw: 45,
    pitch: -25,
    hotspots: [
      { yaw: 90, pitch: -26, label: 'Reception Lobby', next: 'int_reception_lobby' },
      { yaw: 0, pitch: -39, label: 'Workstation Area', next: 'int_workstation_2' },
      // The opposite lift bank, for the ride up to the terrace, same 2 m floor.
      { yaw: -170, pitch: -39, label: 'Terrace Cafe', next: 'ext_terrace_cafe_1' },
    ],
  },
  int_gf_cafe_waiting: {
    panorama: cf('gf-cafe-waiting'),
    yaw: 170,
    pitch: -10,
    hotspots: [
      // Past the timber screen, back towards the lobby.
      { yaw: 170, pitch: -20, label: 'Reception Lobby', next: 'int_reception_lobby' },
    ],
  },
  int_workstation_1: {
    panorama: cf('workstation-1'),
    // The only scene that declared no opening pitch. Level is fine outdoors,
    // where the rings sit 6 m out, but in here they are 3 m away and land on
    // the bottom edge of the frame.
    yaw: -150,
    pitch: -12,
    hotspots: [
      // Down the stone aisle beside the glazed partition.
      { yaw: -175, pitch: -16, label: 'Workstation Area', next: 'int_workstation_2' },
    ],
  },
  int_workstation_2: {
    panorama: cf('workstation-2'),
    yaw: -30,
    pitch: -15,
    hotspots: [
      // The aisle runs the length of the floor plate to the lift core.
      { yaw: 8, pitch: -16, label: 'Lift Lobby', next: 'int_lift_lobby_2' },
      // The stone circulation floor past the feature wall - the aisle at -45
      // put the ring on a side table.
      { yaw: -130, pitch: -18, label: 'Workstation Area', next: 'int_workstation_1' },
    ],
  },
}
