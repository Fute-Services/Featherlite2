import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Plus, Minus } from "lucide-react";

declare global {
  interface Window {
    pannellum: any;
  }
}

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSceneChange = (sceneId: string) => {
    if (viewerRef.current) {
      viewerRef.current.loadScene(sceneId);
      setCurrentScene(sceneId);
    }
  };

  const createCustomHotspot = (hotspotDiv: HTMLElement, args: { text: string; next: string; rotation: number }) => {
    hotspotDiv.classList.add('custom-hotspot-main');

    const img = document.createElement('img');
    img.src = '/arrowfinal.png';
    img.className = 'custom-arrow-asset';
    img.setAttribute('draggable', 'false');

    const angle = args.rotation || 0;
    setTimeout(() => {
      img.style.transform = `rotate(${angle}deg)`;
    }, 10);

    const span = document.createElement('span');
    span.innerHTML = args.text;
    span.className = 'hotspot-label';

    hotspotDiv.appendChild(img);
    hotspotDiv.appendChild(span);

    img.onclick = () => {
      handleSceneChange(args.next);
    };
  };

  const tourConfig: any = {
    default: {
      firstScene: "ext_entry_gate",
      autoLoad: true,
      sceneFadeDuration: 1000,
      autoRotate: -2,
      autoRotateInactivityDelay: 5000,
    },
    scenes: {
      ext_entry_gate: {
        panorama: "/virtual tour/CAM 01 Entry Gate Hero View.jpeg",
        yaw: 350,
        hotSpots: [
          {
            pitch: -15,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Perspective", next: "ext_entry_perspective", rotation: 0 },
          },
        ],
      },
      ext_entry_perspective: {
        panorama: "/virtual tour/Cam 02 Entry Perspective Inside.jpeg",
        yaw: 260,
        hotSpots: [
          {
            pitch: -10,
            yaw: 270,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Drop Off", next: "ext_drop_off_area", rotation: 0 },
          },
          {
            pitch: -15,
            yaw: 260,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Kids Play Area", next: "ext_kids_play_area", rotation: 270 },
          },
          {
            pitch: -15,
            yaw: 280,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Gate", next: "ext_entry_gate", rotation: 90 },
          },
        ],
      },
      ext_drop_off_area: {
        panorama: "/virtual tour/Cam 11 Drop Off Area.jpeg",
        hotSpots: [
          {
            pitch: -20,
            yaw: 10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Open Seating Area", next: "ext_open_seating", rotation: 90 },
          },
          {
            pitch: -15,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 0 },
          },
          {
            pitch: -20,
            yaw: -10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Perspective", next: "ext_entry_perspective", rotation: 270 },
          },
        ],
      },
      ext_kids_play_area: {
        panorama: "/virtual tour/Cam 06 Kids Play Area.jpeg",
        pitch: -15,

        hotSpots: [
          {
            pitch: -30,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Entry Perspective", next: "ext_entry_perspective", rotation: 90 },
          },
        ],
      },
      ext_open_seating: {
        panorama: "/virtual tour/Cam 07 GF Open Seating Area.jpeg",
        pitch: -15,
        hotSpots: [
          {
            pitch: -25,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Drop Off", next: "ext_drop_off_area", rotation: 180 },
          },
        ],
      },
      ext_terrace_cafe_1: {
        panorama: "/virtual tour/Cam 08 Terrace Cafe Area.jpeg",
        pitch: -20,
        hotSpots: [
          {
            pitch: -25,
            yaw: -10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_2", rotation: 0 },
          },
          {
            pitch: -30,
            yaw: -10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Lift Lobby", next: "int_lift_lobby_2", rotation: 180 },
          },
        ],
      },
      ext_terrace_cafe_2: {
        panorama: "/virtual tour/Cam 10 Terrace Cafe Area 02.jpeg",
        pitch: -20,
        hotSpots: [
          {
            pitch: -35,
            yaw: 10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Multipurpose Court", next: "ext_multipurpose_court", rotation: 180 },
          },
          {
            pitch: -30,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_1", rotation: 270 },
          },
        ],
      },
      ext_multipurpose_court: {
        panorama: "/virtual tour/Cam 09 Terrace Multipurpose Court.jpeg",
        pitch: -10,
        hotSpots: [
          {
            pitch: -30,
            yaw: -10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_2", rotation: 270 },
          },
          {
            pitch: -33,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception", next: "int_reception_lobby", rotation: 180 },
          },
        ],
      },
      int_reception_lobby: {
        panorama: "/virtual tour/Cam 03 Reception Lobby.jpeg",
        pitch: -10,
        yaw: -50,
        hotSpots: [
          {
            pitch: -25,
            yaw: -50,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Lift Lobby", next: "int_lift_lobby", rotation: -60 },
          },
          {
            pitch: -25,
            yaw: -40,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "GF Cafe & Waiting Area", next: "int_gf_cafe_waiting", rotation: 30 },
          },
          {
            pitch: -30,
            yaw: -40,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Drop Off", next: "ext_drop_off_area", rotation: 130 },
          },
        ],
      },
      int_lift_lobby: {
        panorama: "/virtual tour/Cam 04 Lift Lobby.jpeg",
        pitch: -25,
        hotSpots: [
          {
            pitch: -35,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_2", rotation: 0 },
          },
          {
            pitch: -35,
            yaw: 10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 90 },
          },
        ],
      },
      int_lift_lobby_2: {
        panorama: "/virtual tour/Cam 04 Lift Lobby.jpeg",
        pitch: -25,
        hotSpots: [
          {
            pitch: -35,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Terrace Cafe", next: "ext_terrace_cafe_1", rotation: 0 },
          },
          {
            pitch: -38,
            yaw: 10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_2", rotation: 90 },
          },
          {
            pitch: -40,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 180 },
          },
        ],
      },
      int_gf_cafe_waiting: {
        panorama: "/virtual tour/Cam 05 GF Cafe & Waiting Area.jpeg",
        pitch: -10,
        yaw: 180,
        hotSpots: [
          {
            pitch: -25,
            yaw: 180,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Reception Lobby", next: "int_reception_lobby", rotation: 180 },
          },
        ],
      },
      int_workstation_1: {
        panorama: "/virtual tour/CAM 05 Workstation 01.jpeg",
        hotSpots: [
          {
            pitch: -15,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_2", rotation: 180 },
          },
        ],
      },
      int_workstation_2: {
        panorama: "/virtual tour/CAM 05 Workstation 02.jpeg",
        pitch: -15,
        hotSpots: [
          {
            pitch: -20,
            yaw: 10,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Lift Lobby", next: "int_lift_lobby_2", rotation: 90 },
          },
          {
            pitch: -15,
            yaw: 0,
            type: "custom",
            createTooltipFunc: (d: any, a: any) => createCustomHotspot(d, a),
            createTooltipArgs: { text: "Workstation Area", next: "int_workstation_1", rotation: 0 },
          },
        ],
      },
    },
  };


  useEffect(() => {
    let timer: any;
    if (window.pannellum && !viewerRef.current) {
      timer = setTimeout(() => {
        try {
          viewerRef.current = window.pannellum.viewer("pan-container", {
            ...tourConfig,
            showControls: false,
            mouseZoom: true,
          });

          viewerRef.current.on("load", () => {
            setCurrentScene(viewerRef.current.getScene());
          });
        } catch (err) {
          console.error("Error initializing Pannellum:", err);
        }
      }, 50);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleZoomIn = () =>
    viewerRef.current?.setHfov(viewerRef.current.getHfov() - 10);
  const handleZoomOut = () =>
    viewerRef.current?.setHfov(viewerRef.current.getHfov() + 10);





  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      {/* Back Button (Hidden/Commented as Header/Logo handles navigation) */}
      {/* 
      <button
        aria-label="Back"
        className="absolute top-8 left-8 sm:top-12 sm:left-12 flex size-10 sm:size-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105 hover:bg-black/70 z-50 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-5" />
      </button> 
      */}

      {/* Zoom Controls */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        <button
          aria-label="Zoom In"
          onClick={handleZoomIn}
          className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105 hover:bg-black/70 cursor-pointer"
        >
          <Plus className="size-5" />
        </button>
        <button
          aria-label="Zoom Out"
          onClick={handleZoomOut}
          className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105 hover:bg-black/70 cursor-pointer"
        >
          <Minus className="size-5" />
        </button>
      </div>

      <div id="pan-container" className="w-full h-full"></div>

      {/* Custom Level/Area Dropdown */}
      <div className="absolute bottom-24 left-36 sm:left-[24%] lg:left-[18%]  z-50">
        <div className="relative">
          {/* Dropdown Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-8 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full font-medium hover:bg-black/60 transition-colors shadow-lg"
          >
            <span>Levels</span>
            <div className="bg-[#FF0000] rounded-full p-1 flex items-center justify-center">
              <ChevronUp
                size={16}
                strokeWidth={3}
                className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* Click outside overlay */}
                <div
                  className="fixed inset-0 z-0 cursor-default"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-[calc(100%+12px)]  transform -translate-x-1/2 flex flex-col gap-3 min-w-[140px] items-stretch z-10"
                >
                  <button
                    onClick={() => {
                      handleSceneChange('ext_drop_off_area');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-2 rounded-full text-sm font-medium shadow-lg transition-colors whitespace-nowrap ${currentScene === 'ext_drop_off_area'
                      ? 'bg-[#FF0000] text-white'
                      : 'bg-black/60 hover:bg-red-700/80 border border-white/10 text-white/80'
                      }`}
                  >
                    Drop Off
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('int_reception_lobby');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-2 rounded-full text-sm font-medium shadow-lg transition-colors whitespace-nowrap ${currentScene === 'int_reception_lobby'
                      ? 'bg-[#FF0000] text-white'
                      : 'bg-black/60 hover:bg-red-700/80 border border-white/10 text-white/80'
                      }`}
                  >
                    Reception
                  </button>
                  <button
                    onClick={() => {
                      handleSceneChange('ext_terrace_cafe_1');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-5 py-2 rounded-full text-sm font-medium shadow-lg transition-colors whitespace-nowrap ${["ext_terrace_cafe_1", "ext_terrace_cafe_2", "ext_multipurpose_court"].includes(currentScene)
                      ? 'bg-[#FF0000] text-white'
                      : 'bg-black/60 hover:bg-red-700/80 border border-white/10 text-white/80'
                      }`}
                  >
                    Terrace Level
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

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
          
          /* Custom arrow hotspots styling */
          .custom-hotspot-main { 
            display: flex !important; 
            flex-direction: column !important; 
            align-items: center !important; 
            justify-content: center !important; 
            pointer-events: auto !important; 
          }
          .custom-arrow-asset { 
            width: 50px !important; 
            height: 50px !important; 
            min-width: 50px !important; 
            min-height: 50px !important; 
            cursor: pointer !important; 
            display: block !important; 
            transition: transform 0.3s ease !important, opacity 0.2s ease !important; 
            opacity: 0.85;
            user-select: none !important;
            -webkit-user-drag: none !important;
          }
          .custom-arrow-asset:hover { opacity: 1; }

          /* Custom Tooltip Styling (Small Pill Badge) */
          .hotspot-label { 
            visibility: hidden; 
            position: absolute; 
            bottom: 60px; 
            background: rgba(20, 20, 20, 0.85) !important; 
            color: white !important; 
            padding: 6px 14px !important; 
            border-radius: 9999px !important; 
            white-space: nowrap !important; 
            font-weight: 500 !important; 
            font-size: 13px !important; 
            border: 1px solid rgba(255,255,255,0.15) !important; 
            pointer-events: none !important; 
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            transition: opacity 0.15s ease, visibility 0.15s ease !important;
            opacity: 0;
          }
          .custom-hotspot-main:hover .hotspot-label { 
            visibility: visible; 
            opacity: 1;
          }

          .pnlm-hotspot-base { background: none !important; }
          .pnlm-load-box, .pnlm-lbox, .pnlm-loading-indicator { display: none !important; }
          .pnlm-container { background-image: none !important; background-color: transparent !important; }
        `}</style>
    </div>
  );
}
