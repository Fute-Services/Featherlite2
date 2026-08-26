import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Plus, Minus } from "lucide-react";

declare global {
  interface Window {
    pannellum: any;
  }
}

// Panoramas already ship under public/virtual tour/ (existing assets)
const vt = (name: string) => `/virtual tour/${encodeURIComponent(name)}`;

const vrCategories: Record<string, { id: string; name: string }[]> = {
  Exterior: [
    { id: "ext_entry_gate", name: "Entry Gate" },
    { id: "ext_entry_perspective", name: "Entry Perspective" },
    { id: "ext_drop_off_area", name: "Drop Off" },
    { id: "ext_kids_play_area", name: "Kids Play Area" },
    { id: "ext_open_seating", name: "Open Seating Area" },
    { id: "ext_terrace_cafe_1", name: "Terrace Cafe" },
    { id: "ext_terrace_cafe_2", name: "Terrace Cafe" },
    { id: "ext_multipurpose_court", name: "Terrace Multipurpose Court" },
  ],
  Interior: [
    { id: "int_reception_lobby", name: "Reception Lobby" },
    { id: "int_lift_lobby", name: "Lift Lobby" },
    { id: "int_lift_lobby_2", name: "Lift Lobby" },
    { id: "int_gf_cafe_waiting", name: "GF Cafe & Waiting Area" },
    { id: "int_workstation_1", name: "Workstation Area" },
    { id: "int_workstation_2", name: "Workstation Area" },
  ],
};

export default function Vr() {
  const [currentScene, setCurrentScene] = useState<string>("ext_entry_gate");
  const viewerRef = useRef<any>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const handleSceneChange = useCallback((sceneId: string) => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    // Zoom in briefly before cutting to the next scene, so moving through
    // a hotspot feels like stepping forward rather than a jump-cut.
    const startHfov = viewer.getHfov();
    const targetHfov = Math.max(startHfov - 15, 30);
    const duration = 350;
    const startTime = performance.now();

    const animateZoom = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      viewer.setHfov(startHfov + (targetHfov - startHfov) * t);
      if (t < 1) {
        requestAnimationFrame(animateZoom);
      } else {
        viewer.loadScene(sceneId);
        setCurrentScene(sceneId);
      }
    };
    requestAnimationFrame(animateZoom);
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Virtual Tour", url: window.location.href });
      } catch {
        // user cancelled share sheet, nothing to do
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, []);

  const createCustomHotspot = useCallback((hotspotDiv: HTMLElement, args: { text: string; next: string; rotation: number }) => {
    hotspotDiv.classList.add('custom-hotspot-main');
    hotspotDiv.innerHTML = `
      <div class="hotspot-marker">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" stroke-width="2" style="transform: rotate(${args.rotation || 0}deg)">
          <path d="M6 15l6-6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <span class="hotspot-label">${args.text}</span>
    `;

    hotspotDiv.onclick = () => {
      handleSceneChange(args.next);
    };

    // Auto-rotate keeps repositioning this div every frame; freeze it the
    // instant the pointer arrives so a click's mousedown/mouseup can't have
    // the marker drift out from under the cursor mid-click.
    hotspotDiv.addEventListener("pointerenter", () => {
      viewerRef.current?.stopAutoRotate();
    });
  }, [handleSceneChange]);

  const tourConfig: any = useMemo(() => ({
    default: {
      firstScene: "ext_entry_gate",
      autoLoad: true,
      sceneFadeDuration: 1000,
      autoRotate: -2,
      autoRotateInactivityDelay: 5000,
    },
    scenes: {
      ext_entry_gate: {
        panorama: vt("CAM_01_Entry_Gate_Hero_View_1_1_n8epa4.jpg"),
        yaw: 350,
        hotSpots: [
          {
            pitch: -5,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Perspective", next: "ext_entry_perspective", rotation: 0 },
          },
        ],
      },
      ext_entry_perspective: {
        panorama: vt("Cam_02_Entry_Perspective_Inside_1_1_gnb1hi.jpg"),
        yaw: 260,
        hotSpots: [
          {
            pitch: -5,
            yaw: 260,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Drop Off", next: "ext_drop_off_area", rotation: 0 },
          },
          {
            pitch: -5,
            yaw: 220,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Kids Play Area", next: "ext_kids_play_area", rotation: 270 },
          },
          {
            pitch: -5,
            yaw: 300,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Gate", next: "ext_entry_gate", rotation: 90 },
          },
        ],
      },
      ext_drop_off_area: {
        panorama: vt("Cam_11_Drop_Off_Area_opt.jpg"),
        hotSpots: [
          {
            pitch: -5,
            yaw: 35,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Open Seating Area", next: "ext_open_seating", rotation: 90 },
          },
          {
            pitch: -5,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 0 },
          },
          {
            pitch: -5,
            yaw: -35,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Perspective", next: "ext_entry_perspective", rotation: 270 },
          },
        ],
      },
      ext_kids_play_area: {
        panorama: vt("Cam_06_Kids_Play_Area_1_1_feonwl.jpg"),
        pitch: -15,

        hotSpots: [
          {
            pitch: -5,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Perspective", next: "ext_entry_perspective", rotation: 90 },
          },
        ],
      },
      ext_open_seating: {
        panorama: vt("Cam_07_GF_Open_Seating_Area_1_1_livzbf.jpg"),
        pitch: -15,
        hotSpots: [
          {
            pitch: -5,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Drop Off", next: "ext_drop_off_area", rotation: 180 },
          },
        ],
      },
      ext_terrace_cafe_1: {
        panorama: vt("Cam_08_Terrace_Cafe_Area_1_1_hpgybq.jpg"),
        pitch: -20,
        hotSpots: [
          {
            pitch: -5,
            yaw: -20,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_2", rotation: 0 },
          },
          {
            pitch: -5,
            yaw: 20,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Lift Lobby", next: "int_lift_lobby_2", rotation: 180 },
          },
        ],
      },
      ext_terrace_cafe_2: {
        panorama: vt("Cam_10_Terrace_Cafe_Area_02_1_1_pubwuq.jpg"),
        pitch: -20,
        hotSpots: [
          {
            pitch: -5,
            yaw: 30,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Multipurpose Court", next: "ext_multipurpose_court", rotation: 180 },
          },
          {
            pitch: -5,
            yaw: -30,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_1", rotation: 270 },
          },
        ],
      },
      ext_multipurpose_court: {
        panorama: vt("Cam_09_Terrace_Multipurpose_Court_2_1_1_eeujyx.jpg"),
        pitch: -10,
        hotSpots: [
          {
            pitch: -5,
            yaw: -30,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_2", rotation: 270 },
          },
          {
            pitch: -5,
            yaw: 30,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception", next: "int_reception_lobby", rotation: 180 },
          },
        ],
      },
      int_reception_lobby: {
        panorama: vt("Cam_03_Reception_Lobby_opt.jpg"),
        pitch: -10,
        yaw: -50,
        hotSpots: [
          {
            pitch: -5,
            yaw: -50,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Lift Lobby", next: "int_lift_lobby", rotation: -60 },
          },
          {
            pitch: -5,
            yaw: -15,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "GF Cafe & Waiting Area", next: "int_gf_cafe_waiting", rotation: 30 },
          },
          {
            pitch: -5,
            yaw: 25,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Drop Off", next: "ext_drop_off_area", rotation: 130 },
          },
        ],
      },
      int_lift_lobby: {
        panorama: vt("Cam_04_Lift_Lobby_opt.jpg"),
        pitch: -25,
        hotSpots: [
          {
            pitch: -5,
            yaw: -20,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_2", rotation: 0 },
          },
          {
            pitch: -5,
            yaw: 20,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 90 },
          },
        ],
      },
      int_lift_lobby_2: {
        panorama: vt("Cam_04_Lift_Lobby_opt.jpg"),
        pitch: -25,
        hotSpots: [
          {
            pitch: 0,
            yaw: -30,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_1", rotation: 0 },
          },
          {
            pitch: -5,
            yaw: 40,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_2", rotation: 90 },
          },
          {
            pitch: -15,
            yaw: -30,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 180 },
          },
        ],
      },
      int_gf_cafe_waiting: {
        panorama: vt("Cam_05_GF_Cafe_Waiting_opt.jpg"),
        pitch: -10,
        yaw: 180,
        hotSpots: [
          {
            pitch: -5,
            yaw: 180,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 180 },
          },
        ],
      },
      int_workstation_1: {
        panorama: vt("CAM_05_Workstation_01_opt.jpg"),
        hotSpots: [
          {
            pitch: -5,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_2", rotation: 180 },
          },
        ],
      },
      int_workstation_2: {
        panorama: vt("CAM_05_Workstation_02_opt.jpg"),
        pitch: -15,
        hotSpots: [
          {
            pitch: -5,
            yaw: 20,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Lift Lobby", next: "int_lift_lobby_2", rotation: 90 },
          },
          {
            pitch: -5,
            yaw: -20,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_1", rotation: 0 },
          },
        ],
      },
    },
  }), [createCustomHotspot]);


  // Pannellum is only needed on this page, so load it here instead of
  // blocking every other route's first paint via index.html.
  useEffect(() => {
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("pannellum-js")) {
      const script = document.createElement("script");
      script.id = "pannellum-js";
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    let pollTimer: any;
    let cancelled = false;

    const initViewer = () => {
      if (cancelled || viewerRef.current) return;
      try {
        // Held locally as well as in the ref: a panorama that finishes decoding
        // after the page is left still fires "load", and by then the ref has
        // been cleared - reading it there threw an uncaught TypeError out of
        // Pannellum's event dispatch every time the tour was navigated away
        // from.
        const viewer = window.pannellum.viewer("pan-container", {
          ...tourConfig,
          showControls: false,
          mouseZoom: true,
        });
        viewerRef.current = viewer;

        viewer.on("load", () => {
          if (cancelled) return;
          setCurrentScene(viewer.getScene());
        });
      } catch (err) {
        console.error("Error initializing Pannellum:", err);
      }
    };

    const waitForPannellum = () => {
      if (window.pannellum) {
        initViewer();
      } else {
        pollTimer = setTimeout(waitForPannellum, 100);
      }
    };

    waitForPannellum();

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {
          // tearing down mid-load can trip over Pannellum's own internals;
          // the container is going away regardless
        }
        viewerRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () =>
    viewerRef.current?.setHfov(viewerRef.current.getHfov() - 10);
  const handleZoomOut = () =>
    viewerRef.current?.setHfov(viewerRef.current.getHfov() + 10);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      {/* Share Button */}
      <button
        onClick={handleShare}
        aria-label="Share"
        className="absolute top-8 right-8 sm:top-6 sm:right-6 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors shadow-lg"
      >
        {shareCopied ? (
          <span className="text-[10px] font-medium whitespace-nowrap px-1">Copied!</span>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          </svg>
        )}
      </button>

      {/* Zoom Controls */}
      <div className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 p-1.5 rounded-full bg-gradient-to-b from-black/50 via-black/60 to-black/70 backdrop-blur-xl backdrop-saturate-150 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.37)]">
        <button
          onClick={handleZoomIn}
          aria-label="Zoom In"
          className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#FF0000]/85 backdrop-blur-sm border border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(231,0,0,0.4)] hover:bg-[#FF0000] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
        <div className="w-6 h-px bg-white/15" />
        <button
          onClick={handleZoomOut}
          aria-label="Zoom Out"
          className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
      </div>

      <div id="pan-container" className="w-full h-full"></div>

      {/* Active Scene Display Label */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-md text-white px-5 py-2 rounded-full border border-white/10 shadow-2xl font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase text-center whitespace-nowrap">
          {(() => {
            for (const cat of Object.values(vrCategories)) {
              const match = cat.find((item) => item.id === currentScene);
              if (match) return match.name;
            }
            return currentScene.replace(/^(ext_|int_)/, "").replace(/_/g, " ").toUpperCase();
          })()}
        </div>
      </div>

      {/* Hide scrollbar utility & Custom hotspot styles */}
      <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .pnlm-load-box { display: none !important; }

          /* Custom hotspot marker: thin-ring circle + chevron + plain label,
             matching the reference tour. Pannellum forces a 26x26 box, a
             sprite background, and a hover tint on every .pnlm-hotspot, and
             centers hotspots using the div's own offsetWidth/offsetHeight;
             override all of that and fix the box to 44x44 so the centering
             math lines up with the circle (the label is absolutely
             positioned below so it doesn't affect that box size). */
          .custom-hotspot-main {
            width: 44px !important;
            height: 44px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            pointer-events: auto !important;
            background: none !important;
            background-image: none !important;
            border-radius: 9999px !important;
          }
          .custom-hotspot-main:hover { background-color: transparent !important; }
          .custom-hotspot-main .hotspot-marker {
            width: 44px;
            height: 44px;
            border-radius: 9999px;
            border: 2px solid rgba(255, 255, 255, 0.9);
            background: rgba(0, 0, 0, 0.55);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .custom-hotspot-main .hotspot-label {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 6px;
            color: white !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
            white-space: nowrap !important;
          }

          .pnlm-hotspot-base { background: none !important; }
          .pnlm-load-box, .pnlm-lbox, .pnlm-loading-indicator { display: none !important; }
          .pnlm-container { background-image: none !important; background-color: transparent !important; }
        `}</style>
    </div>
  );
}
