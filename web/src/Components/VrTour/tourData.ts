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
 * The tour reads the re-exported panoramas in public/virtual tour/opt/.
 *
 * The originals next to them are 12000x6000 and 12-18 MB each. That is far more
 * than a 360 viewer can use - the sphere is sampled at roughly 1:1 on screen -
 * and it cost a multi-second wait on every single scene change while the file
 * came down. The opt/ copies are 4096x2048 and about 1 MB, which is 500 MB of
 * panoramas down to 16 MB across the whole tour. The originals are left in
 * place, untouched.
 */
const vt = (name: string) => `/virtual tour/opt/${encodeURIComponent(name)}`

export const FIRST_SCENE = 'ext_entry_gate'

export const vrCategories: Record<string, { id: string; name: string }[]> = {
  Exterior: [
    { id: 'ext_entry_gate', name: 'Entry Gate' },
    { id: 'ext_entry_perspective', name: 'Entry Perspective' },
    { id: 'ext_drop_off_area', name: 'Drop Off' },
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
    panorama: vt('CAM_01_Entry_Gate_Hero_View_1_1_n8epa4.jpg'),
    yaw: 350,
    hotspots: [
      { yaw: 0, pitch: -5, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_entry_perspective: {
    panorama: vt('Cam_02_Entry_Perspective_Inside_1_1_gnb1hi.jpg'),
    yaw: 260,
    hotspots: [
      { yaw: 260, pitch: -5, label: 'Drop Off', next: 'ext_drop_off_area' },
      { yaw: 220, pitch: -12, label: 'Kids Play Area', next: 'ext_kids_play_area' },
      { yaw: 300, pitch: -20, label: 'Entry Gate', next: 'ext_entry_gate' },
    ],
  },
  ext_drop_off_area: {
    panorama: vt('Cam_11_Drop_Off_Area_opt.jpg'),
    hotspots: [
      { yaw: 35, pitch: -12, label: 'Open Seating Area', next: 'ext_open_seating' },
      { yaw: 0, pitch: -5, label: 'Reception Lobby', next: 'int_reception_lobby' },
      { yaw: -35, pitch: -20, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_kids_play_area: {
    panorama: vt('Cam_06_Kids_Play_Area_1_1_feonwl.jpg'),
    pitch: -15,
    hotspots: [
      { yaw: 0, pitch: -8, label: 'Entry Perspective', next: 'ext_entry_perspective' },
    ],
  },
  ext_open_seating: {
    panorama: vt('Cam_07_GF_Open_Seating_Area_1_1_livzbf.jpg'),
    pitch: -15,
    hotspots: [
      { yaw: 0, pitch: -8, label: 'Drop Off', next: 'ext_drop_off_area' },
    ],
  },
  ext_terrace_cafe_1: {
    panorama: vt('Cam_08_Terrace_Cafe_Area_1_1_hpgybq.jpg'),
    pitch: -20,
    hotspots: [
      { yaw: -20, pitch: -16, label: 'Terrace Cafe', next: 'ext_terrace_cafe_2' },
      { yaw: 20, pitch: -26, label: 'Lift Lobby', next: 'int_lift_lobby_2' },
    ],
  },
  ext_terrace_cafe_2: {
    panorama: vt('Cam_10_Terrace_Cafe_Area_02_1_1_pubwuq.jpg'),
    pitch: -20,
    hotspots: [
      { yaw: 30, pitch: -16, label: 'Terrace Multipurpose Court', next: 'ext_multipurpose_court' },
      { yaw: -30, pitch: -26, label: 'Terrace Cafe', next: 'ext_terrace_cafe_1' },
    ],
  },
  ext_multipurpose_court: {
    panorama: vt('Cam_09_Terrace_Multipurpose_Court_2_1_1_eeujyx.jpg'),
    pitch: -10,
    hotspots: [
      { yaw: -30, pitch: -16, label: 'Terrace Cafe', next: 'ext_terrace_cafe_2' },
      { yaw: 30, pitch: -26, label: 'Reception', next: 'int_reception_lobby' },
    ],
  },
  int_reception_lobby: {
    panorama: vt('Cam_03_Reception_Lobby_opt.jpg'),
    pitch: -10,
    yaw: -50,
    hotspots: [
      { yaw: -50, pitch: -22, label: 'Lift Lobby', next: 'int_lift_lobby' },
      { yaw: -15, pitch: -26, label: 'GF Cafe & Waiting Area', next: 'int_gf_cafe_waiting' },
      { yaw: 25, pitch: -30, label: 'Drop Off', next: 'ext_drop_off_area' },
    ],
  },
  int_lift_lobby: {
    panorama: vt('Cam_04_Lift_Lobby_opt.jpg'),
    pitch: -25,
    hotspots: [
      { yaw: -20, pitch: -28, label: 'Workstation Area', next: 'int_workstation_2' },
      { yaw: 20, pitch: -34, label: 'Reception Lobby', next: 'int_reception_lobby' },
    ],
  },
  int_lift_lobby_2: {
    panorama: vt('Cam_04_Lift_Lobby_opt.jpg'),
    pitch: -25,
    hotspots: [
      { yaw: -30, pitch: -24, label: 'Terrace Cafe', next: 'ext_terrace_cafe_1' },
      { yaw: 40, pitch: -30, label: 'Workstation Area', next: 'int_workstation_2' },
      { yaw: -10, pitch: -36, label: 'Reception Lobby', next: 'int_reception_lobby' },
    ],
  },
  int_gf_cafe_waiting: {
    panorama: vt('Cam_05_GF_Cafe_Waiting_opt.jpg'),
    pitch: -10,
    yaw: 180,
    hotspots: [
      { yaw: 180, pitch: -26, label: 'Reception Lobby', next: 'int_reception_lobby' },
    ],
  },
  int_workstation_1: {
    panorama: vt('CAM_05_Workstation_01_opt.jpg'),
    // The only scene that declared no opening pitch. Level is fine outdoors,
    // where the rings sit 6 m out, but in here they are 3 m away and land on
    // the bottom edge of the frame.
    pitch: -12,
    hotspots: [
      { yaw: 0, pitch: -26, label: 'Workstation Area', next: 'int_workstation_2' },
    ],
  },
  int_workstation_2: {
    panorama: vt('CAM_05_Workstation_02_opt.jpg'),
    pitch: -15,
    hotspots: [
      { yaw: 20, pitch: -24, label: 'Lift Lobby', next: 'int_lift_lobby_2' },
      { yaw: -20, pitch: -32, label: 'Workstation Area', next: 'int_workstation_1' },
    ],
  },
}
