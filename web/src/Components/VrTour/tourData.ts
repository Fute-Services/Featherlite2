/**
 * Scene graph for the 360 tour.
 *
 * `yaw`/`pitch` on a scene are the camera's opening framing; `yaw`/`pitch` on a
 * hotspot say where the destination is. Both are degrees, yaw increasing to the
 * right, pitch positive up - the same convention `heading()` in floorMarkers.ts
 * uses, and the same one the numbers were originally authored against.
 *
 * DEVIATION FROM THE ORIGINAL DATA, ON PURPOSE: every hotspot in the Pannellum
 * version carried pitch -5 (one 0, one -15), because with eye-level arrows pitch
 * only nudged the sticker up or down and -5 read fine everywhere. Fed to
 * distanceForPitch() that means 1.6 / tan(5deg) = 18.3 m for all of them, which
 * clamps to the 6 m ceiling for all of them - every ring in a scene at the same
 * depth, at the same screen size, in a row. That is exactly the clustering the
 * floor rings exist to remove. The pitches below are re-authored per hotspot so
 * a near destination sits near: about -6 for a far one (clamps to 6 m), -12 to
 * -16 for a mid one (7.5 m -> clamped, 5.6 m), -20 to -24 for a close one
 * (4.4 m, 3.6 m). Eyeballed against the photography, exactly as the originals
 * were. Yaw, label and target are untouched.
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
    yaw: 350,
    hotspots: [
      { yaw: 0, pitch: -5, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_entry_perspective: {
    panorama: cf('entry-perspective'),
    yaw: 260,
    hotspots: [
      { yaw: 265, pitch: -8, label: 'Arrival Plaza', next: 'ext_drop_off_area' },
      { yaw: 185, pitch: -18, label: 'Kids Play Area', next: 'ext_kids_play_area' },
      { yaw: 335, pitch: -22, label: 'Entry Gate', next: 'ext_entry_gate' },
    ],
  },
  ext_drop_off_area: {
    panorama: cf('drop-off-area'),
    hotspots: [
      { yaw: 48, pitch: -20, label: 'Open Seating Area', next: 'ext_open_seating' },
      { yaw: 0, pitch: -5, label: 'Reception Lobby', next: 'int_reception_lobby' },
      { yaw: -52, pitch: -16, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_kids_play_area: {
    panorama: cf('kids-play-area'),
    pitch: -15,
    hotspots: [
      { yaw: 0, pitch: -30, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_open_seating: {
    panorama: cf('open-seating-area'),
    pitch: -15,
    hotspots: [
      { yaw: 0, pitch: -8, label: 'Arrival Plaza', next: 'ext_drop_off_area' },
    ],
  },
  ext_terrace_cafe_1: {
    panorama: cf('terrace-cafe-1'),
    pitch: -20,
    hotspots: [
      { yaw: -20, pitch: -16, label: 'Terrace Cafe', next: 'ext_terrace_cafe_2' },
      { yaw: 20, pitch: -26, label: 'Lift Lobby', next: 'int_lift_lobby_2' },
    ],
  },
  ext_terrace_cafe_2: {
    panorama: cf('terrace-cafe-2'),
    pitch: -20,
    hotspots: [
      { yaw: 30, pitch: -16, label: 'Terrace Multipurpose Court', next: 'ext_multipurpose_court' },
      { yaw: -30, pitch: -26, label: 'Terrace Cafe', next: 'ext_terrace_cafe_1' },
    ],
  },
  ext_multipurpose_court: {
    panorama: cf('multipurpose-court'),
    pitch: -10,
    hotspots: [
      { yaw: -30, pitch: -16, label: 'Terrace Cafe', next: 'ext_terrace_cafe_2' },
      { yaw: 30, pitch: -26, label: 'Reception', next: 'int_reception_lobby' },
    ],
  },
  int_reception_lobby: {
    panorama: cf('reception-lobby'),
    pitch: -10,
    yaw: -50,
    hotspots: [
      { yaw: -50, pitch: -30, label: 'Lift Lobby', next: 'int_lift_lobby' },
      { yaw: -16, pitch: -28, label: 'GF Cafe & Waiting Area', next: 'int_gf_cafe_waiting' },
      { yaw: 29, pitch: -25, label: 'Arrival Plaza', next: 'ext_drop_off_area' },
    ],
  },
  int_lift_lobby: {
    panorama: cf('lift-lobby'),
    pitch: -25,
    hotspots: [
      { yaw: -20, pitch: -28, label: 'Workstation Area', next: 'int_workstation_2' },
      { yaw: 20, pitch: -34, label: 'Reception Lobby', next: 'int_reception_lobby' },
    ],
  },
  int_lift_lobby_2: {
    panorama: cf('lift-lobby'),
    pitch: -25,
    hotspots: [
      { yaw: -30, pitch: -24, label: 'Terrace Cafe', next: 'ext_terrace_cafe_1' },
      { yaw: 40, pitch: -30, label: 'Workstation Area', next: 'int_workstation_2' },
      { yaw: -10, pitch: -36, label: 'Reception Lobby', next: 'int_reception_lobby' },
    ],
  },
  int_gf_cafe_waiting: {
    panorama: cf('gf-cafe-waiting'),
    pitch: -10,
    yaw: 180,
    hotspots: [
      { yaw: 180, pitch: -26, label: 'Reception Lobby', next: 'int_reception_lobby' },
    ],
  },
  int_workstation_1: {
    panorama: cf('workstation-1'),
    // The only scene that declared no opening pitch. Level is fine outdoors,
    // where the rings sit 6 m out, but in here they are 3 m away and land on
    // the bottom edge of the frame.
    pitch: -12,
    hotspots: [
      { yaw: 0, pitch: -26, label: 'Workstation Area', next: 'int_workstation_2' },
    ],
  },
  int_workstation_2: {
    panorama: cf('workstation-2'),
    pitch: -15,
    hotspots: [
      { yaw: 12, pitch: -22, label: 'Lift Lobby', next: 'int_lift_lobby_2' },
      { yaw: -20, pitch: -32, label: 'Workstation Area', next: 'int_workstation_1' },
    ],
  },
}
