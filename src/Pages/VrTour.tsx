// import PageShell from '../components/PageShell/PageShell'
import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    pannellum: any;
  }
}

const vrCategories: Record<string, { id: string; name: string }[]> = {};


export default function Vr() {
  const [currentScene, setCurrentScene] = useState<string>("");
  const viewerRef = useRef<any>(null);

  const tourConfig: any = {
    default: {
      firstScene: "",
      autoLoad: true,
      sceneFadeDuration: 1000,
      autoRotate: -2,
      autoRotateInactivityDelay: 5000,
    },
    scenes: {},
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
