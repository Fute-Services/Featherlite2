import React, { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    Maximize2,
    PieChart,
    Trees,
    Eye,
    EyeOff,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";


import icon1 from "../../assets/sidenavbar/Maximize button.png";
import icon2 from "../../assets/sidenavbar/Layout button.png"; // Selected Layout Icon

import selectedicon3 from "../../assets/sidenavbar/selected building.png"; // Selected Section/Building Icon
import { Link } from "react-router-dom";

interface SidebarProps {
    onLayoutSelect?: (layout: string) => void;
    onLabelsToggle?: (show: boolean) => void;
    onCirculationSelect?: (circulation: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    onLayoutSelect,
    onLabelsToggle,
    onCirculationSelect,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);


    // Inside your Sidebar component:
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("floor-plan")) {
            setActiveTab("section");
        } else if (location.pathname.includes("masterplan")) {
            setActiveTab("layout");
        }
    }, [location.pathname]);


    // Track active navigation tab ('layout' | 'section')
    const [activeTab, setActiveTab] = useState<"layout" | "section">("layout");

    // Dropdown states
    const [isLayoutOpen, setIsLayoutOpen] = useState<boolean>(true);
    const [showLabels, setShowLabels] = useState<boolean>(false);
    const [isCirculationOpen, setIsCirculationOpen] = useState<boolean>(false);

    // Selection state values
    const [selectedLayout, setSelectedLayout] = useState<string>("Layout");
    const [selectedCirculation, setSelectedCirculation] = useState<string>("Circulation");

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };




    // const handleTabClick = (tab: "layout" | "section") => {
    //     setActiveTab(tab);
    //     if (!isOpen) {
    //         setIsOpen(true);
    //     }
    //     if (tab === "layout") {
    //         setIsLayoutOpen((prev) => !prev);
    //         setIsSectionOpen(false);
    //     } else {
    //         setIsSectionOpen((prev) => !prev);
    //         setIsLayoutOpen(false);
    //     }
    // };

    const handleLayoutClick = (layout: string) => {
        setSelectedLayout(layout);
        setIsLayoutOpen(false);
        setSelectedCirculation("Circulation");
        if (onLayoutSelect) onLayoutSelect(layout);
    };

    return (
        <aside className={`fixed top-0 left-0 w-screen h-screen flex select-none pointer-events-none transition-all duration-300 ${isOpen ? "z-[1005]" : "z-[999]"}`}>
            {/* 1. Left Curved Icon Rail (Enable pointer-events-auto directly on the container) */}
            <div className="relative w-[6%] h-full text-white flex flex-col justify-between py-6 px-3 z-20 pointer-events-auto">

                {/* SVG Background (Set to pointer-events-none so it doesn't trap clicks) */}
                <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 110 800"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            {/* 1. Backdrop Blur Filter for SVG */}
                            <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="8" />
                            </filter>

                            {/* 2. Glass Reflection Gradient */}
                            <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                                <stop offset="50%" stopColor="#000000" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
                            </linearGradient>

                            {/* 3. Outer Drop Shadow Filter */}
                            <filter id="glass-shadow" x="-30%" y="-30%" width="160%" height="160%">
                                <feDropShadow dx="4" dy="4" stdDeviation="12" floodColor="#000000" floodOpacity="0.5" />
                            </filter>
                        </defs>

                        {/* Layer A: Blurred Background Copy (Creates the backdrop blur on the curve) */}
                        <path
                            d="
        M 0 0 
        L 42 0 
        L 42 290 
        C 42 340, 85 330, 85 370 
        L 85 460 
        C 85 500, 42 490, 42 540 
        L 42 800 
        L 0 800 
        Z
      "
                            fill="black"
                            fillOpacity="0.4"
                            filter="url(#glass-blur)"
                        />

                        {/* Layer B: Main Glass Shape with Gradient and Specular Outline */}
                        <path
                            d="
        M 0 0 
        L 42 0 
        L 42 290 
        C 42 340, 85 330, 85 370 
        L 85 460 
        C 85 500, 42 490, 42 540 
        L 42 800 
        L 0 800 
        Z
      "
                            fill="url(#glass-gradient)"
                            stroke="rgba(255, 255, 255, 0.3)"
                            strokeWidth="0.8"
                            filter="url(#glass-shadow)"
                        />
                    </svg>
                </div>

                {/* Top Toggle Button */}
                <div className="flex absolute left-0 justify-center">
                    <button
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                        className="p-0 rounded-lg hover:bg-white/10 transition-colors
                         cursor-pointer outline-none"
                    >
                        <img src={icon1} alt="Toggle" className="w-8 h-8 object-contain" />
                    </button>
                </div>

                <div className="flex absolute left-[20%] top-[44%] flex-col items-center gap-8 my-auto">
                    {/* 1. Master Plan Link Button */}
                    <Link
                        to="/masterplan"
                        onClick={() => {
                            setActiveTab("layout");
                            setIsOpen(true);         // Opens the main side glass panel
                            setIsLayoutOpen(false);  // Keeps the options dropdown menu closed initially
                        }}
                        className="group relative flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer hover:bg-transparent outline-none"
                    >
                        <img
                            src={icon2}
                            alt="Layout Option"
                            className={`w-5 h-5 object-contain transition-transform duration-200 ${activeTab === "layout" ? "filter-gold" : "group-hover:filter-gold"
                                }`}
                        />
                        {isOpen && activeTab === "layout" && (
                            <span className="absolute -right-5 w-2 h-2 rounded-full bg-[#D4AF37]" />
                        )}
                    </Link>

                    {/* 2. Floor Plan Link Button */}
                    <Link
                        to="/floor-plan"
                        onClick={() => {
                            setActiveTab("section");
                            setIsOpen(false);        // Floor Plan starts with the panel collapsed
                            setIsLayoutOpen(false);
                        }}
                        className="group relative flex items-center justify-center p-1 rounded-xl transition-all cursor-pointer hover:bg-transparent outline-none"
                    >
                        <img
                            src={selectedicon3}
                            alt="Building Section Option"
                            className={`w-7 h-7 object-contain transition-transform duration-200 ${activeTab === "section" ? "filter-gold" : "group-hover:filter-gold"
                                }`}
                        />
                        {isOpen && activeTab === "section" && (
                            <span className="absolute -right-5 w-2 h-2 rounded-full bg-[#D4AF37]" />
                        )}
                    </Link>
                </div>

                {/* Bottom Spacer / Anchor */}
                <div className="h-10" />
            </div>

            {/* 2. Expanded Glass Panel Content */}
            <div
                className={`absolute left-0 top-0 h-full pl-[5.5%] flex flex-col
                     justify-between py-6 px-6 text-white
    /* Glassmorphism Core */
    bg-gradient-to-b from-black/55 via-black/70 to-black/85 
    backdrop-blur-xl backdrop-saturate-150
    border-r border-neutral-500/35
    shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
    /* Subtle Inner Highlight for Glass Reflection */
    inset-shadow-sm inset-shadow-white/10
    /* Smooth Transitions */
    transition-all duration-300 ease-in-out overflow-hidden ${isOpen
                        ? "w-72 opacity-100"
                        : "w-0 opacity-0 px-0 pointer-events-none"
                    }`}
            >
                {/* Header Logo 
        <div className="flex flex-col tracking-wide shrink-0">
          <span className="text-red-500 font-serif italic text-xl leading-tight">
            Featherlite
          </span>
          <span className="text-2xl font-light tracking-widest uppercase leading-tight text-amber-100">
            SIGNATURE
          </span>
          <span className="text-[10px] text-gray-400 font-light tracking-wider uppercase">
            Works for You
          </span>
        </div>*/}

                {/* Middle Interactive Inputs */}

                <div className="flex absolute top-[44%] flex-col gap-3 my-auto w-full pointer-events-auto">

                    {/* 1. Layout Dropdown */}
                    <div className="relative w-full pointer-events-auto">
                        <button
                            onClick={() => {
                                setActiveTab("layout");
                                setIsLayoutOpen((prev) => !prev);
                            }}
                            className={`w-[60%] flex items-center justify-between px-4 py-1.5 rounded-full border text-xs font-light transition-all duration-200 backdrop-blur-md ${activeTab === "layout"
                                ? "bg-black/35 border-white/50 text-white cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.37)]"
                                : "bg-black/20 hover:bg-black/30 border-white/35 text-white cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.25)]"
                                }`}
                        >
                            <span className="truncate">{selectedLayout}</span>
                            {isLayoutOpen ? (
                                <ChevronUp className="w-3.5 h-3.5 text-white/70" />
                            ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                            )}
                        </button>

                        {isLayoutOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[60%] bg-black/40 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-1.5 flex flex-col gap-1 text-xs font-light z-30 pointer-events-auto">
                                <button
                                    onClick={() => handleLayoutClick("Ground layout")}
                                    className={`w-full text-left px-3 py-1.5 rounded-full transition-all duration-250 backdrop-blur-sm cursor-pointer border border-transparent ${selectedLayout === "Ground layout"
                                        ? "bg-[rgba(231,33,0,0.30)] text-white border-white/45 shadow-[0_4px_12px_rgba(231,33,0,0.3)]"
                                        : "text-gray-200 hover:bg-[rgba(231,33,0,0.30)] hover:border-white/45 hover:shadow-[0_4px_12px_rgba(231,33,0,0.3)] hover:text-white"
                                        }`}
                                >
                                    Ground layout
                                </button>
                                <button
                                    onClick={() => handleLayoutClick("Terrace layout")}
                                    className={`w-full text-left px-3 py-1.5 rounded-full transition-all duration-250 backdrop-blur-sm cursor-pointer border border-transparent ${selectedLayout === "Terrace layout"
                                        ? "bg-[rgba(231,33,0,0.30)] text-white border-white/45 shadow-[0_4px_12px_rgba(231,33,0,0.3)]"
                                        : "text-gray-200 hover:bg-[rgba(231,33,0,0.30)] hover:border-white/45 hover:shadow-[0_4px_12px_rgba(231,33,0,0.3)] hover:text-white"
                                        }`}
                                >
                                    Terrace layout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 2. Labels Button */}
                    {selectedLayout !== "Layout" && (
                        <button
                            onClick={() => {
                                const newValue = !showLabels;
                                setShowLabels(newValue);
                                if (onLabelsToggle) onLabelsToggle(newValue);
                            }}
                            className={`w-[60%] flex items-center justify-between px-4 py-1.5 rounded-full border text-xs font-light transition-all duration-200 backdrop-blur-md cursor-pointer ${showLabels
                                ? "bg-[rgba(231,33,0,0.30)] text-white border-white/50 shadow-[0_4px_12px_rgba(231,33,0,0.3)]"
                                : "bg-black/20 hover:bg-black/30 border-white/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.25)]"
                                }`}
                        >
                            <span>Labels</span>
                            {showLabels ? (
                                <Eye className="w-3.5 h-3.5 text-white/70" />
                            ) : (
                                <EyeOff className="w-3.5 h-3.5 text-white/70" />
                            )}
                        </button>
                    )}

                    {/* 3. Circulation Dropdown (Visible only for Ground layout) */}
                    {selectedLayout === "Ground layout" && (
                        <div className="relative w-full pointer-events-auto">
                            <button
                                onClick={() => {
                                    setIsCirculationOpen((prev) => !prev);
                                }}
                                className={`w-[60%] flex items-center justify-between px-4 py-1.5 rounded-full border text-xs font-light transition-all duration-200 backdrop-blur-md ${isCirculationOpen
                                    ? "bg-white/10 border-white/50 ring-1 ring-white/10 text-white cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.3)]"
                                    : "bg-black/20 hover:bg-black/30 border-white/35 text-white cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.25)]"
                                    }`}
                            >
                                <span className="truncate">{selectedCirculation}</span>
                                {isCirculationOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-white/70" />
                                ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                                )}
                            </button>

                            {isCirculationOpen && (
                                <div className="absolute top-full left-0 mt-2 w-[60%] bg-black/40 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-1.5 flex flex-col z-30 pointer-events-auto">
                                    {[
                                        "Main Entry/Exit",
                                        "Entry/Exit To Building",
                                        "Ramp Access",
                                        "Visitors Parking",
                                        "Two wheeler Parking",
                                        "Driveway to Drop off",
                                        "Driveway to Basement",
                                        "Walking Lane & Cycling Lane",
                                        "Pedestrian Entry",
                                        "Fire Exit"
                                    ].map((item) => {
                                        const isSelected = selectedCirculation === item;
                                        return (
                                            <button
                                                key={item}
                                                onClick={() => {
                                                    setSelectedCirculation(item);
                                                    setIsCirculationOpen(false);
                                                    if (onCirculationSelect) onCirculationSelect(item);
                                                }}
                                                className={`w-full text-left px-3 py-[3.5px] text-[9px] transition-colors cursor-pointer border-b border-white/10 last:border-0 ${isSelected
                                                    ? "text-white font-bold bg-white/10"
                                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Statistics Section */}
                <div className={`flex flex-col absolute top-[75%] gap-4 border-t border-white/35 pt-4 shrink-0 transition-opacity duration-200 ${isCirculationOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}>
                    <div className="flex items-center gap-3">
                        <Maximize2 className="w-5 h-5 text-gray-300" />
                        <div>
                            <p className="text-sm font-medium text-white">2 Acre</p>
                            <p className="text-[11px] text-gray-400">
                                Massive Site Coverage Area
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <PieChart className="w-5 h-5 text-gray-300" />
                        <div>
                            <p className="text-sm font-medium text-white">43 %</p>
                            <p className="text-[11px] text-gray-400">Free Ground Area</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Trees className="w-5 h-5 text-gray-300" />
                        <div>
                            <p className="text-sm font-medium text-white">25 %</p>
                            <p className="text-[11px] text-gray-400">Luscious Green Area</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;