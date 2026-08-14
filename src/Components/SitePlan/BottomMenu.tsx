import React from "react";
import { Eye, EyeOff, Layers } from "lucide-react";

interface BottomMenuProps {
  isViewActive: boolean;
  onToggleView: () => void;
  currentLevel: "ground" | "terrace";
  onChangeLevel: (level: "ground" | "terrace") => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({
  isViewActive,
  onToggleView,
  currentLevel,
  onChangeLevel,
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4 select-none">
      {/* Level Switcher Pill */}
      <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/40 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl">
        <button
          onClick={() => onChangeLevel("ground")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-light transition-all duration-250 cursor-pointer ${
            currentLevel === "ground"
              ? "bg-[rgba(255,255,255,0.15)] text-white border border-white/30 shadow-[0_4px_12px_rgba(255,255,255,0.15)] font-normal"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Ground Level
        </button>
        <button
          onClick={() => onChangeLevel("terrace")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-light transition-all duration-250 cursor-pointer ${
            currentLevel === "terrace"
              ? "bg-[rgba(255,255,255,0.15)] text-white border border-white/30 shadow-[0_4px_12px_rgba(255,255,255,0.15)] font-normal"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Terrace Level
        </button>
      </div>

      {/* Visibility Toggle Pill */}
      <button
        onClick={onToggleView}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-black/40 text-xs font-light text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.37)] backdrop-blur-xl hover:bg-black/60 transition-all duration-250 cursor-pointer`}
      >
        {isViewActive ? (
          <>
            <Eye className="w-3.5 h-3.5 text-white/70" />
            Hide Labels
          </>
        ) : (
          <>
            <EyeOff className="w-3.5 h-3.5 text-white/70" />
            Show Labels
          </>
        )}
      </button>
    </div>
  );
};

export default BottomMenu;
