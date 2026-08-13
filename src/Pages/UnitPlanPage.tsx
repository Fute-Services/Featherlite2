import { useState } from 'react';
import {
    // ChevronLeft,
    // ChevronRight,
    Plus,
    Minus,
    // Fan,
    // ShieldAlert,
    // User,
    // Monitor,
    // Box,
    // Eye,
    // Glasses,
    // icons
} from 'lucide-react';
import { pointsData } from '../Data/UnitPlanData'
import image from '../assets/floorplan/unit/7th floor 2.png';
import left from '../assets/floorplan/icons/leftside.png';
import right from '../assets/floorplan/icons/right.png'

import VRModel from '../components/FloorPlanPages/VRModel';
import BackButton from '../components/FloorPlanPages/BackButton';
import UnitPlanContentPage from '../components/FloorPlanPages/UnitPlanContentPage';
import UnitPlanSideContent from '../components/FloorPlanPages/UnitPlanSideContent';
import VRModel from '../Components/FloorPlanPages/VRModel';
import BackButton from '../Components/FloorPlanPages/BackButton';
import UnitPlanContentPage from '../Components/FloorPlanPages/UnitPlanContentPage';
import UnitPlanSideContent from '../Components/FloorPlanPages/UnitPlanSideContent';


export default function UnitPlanPage() {
    const [selectedId, setSelectedId] = useState<number>(1);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [viewdata, setViewdata] = useState(true);
    const [showVRModal, setShowVRModal] = useState(false);


    const activePoint = pointsData.find((p) => p.id === selectedId) || pointsData[0];

    const handleNext = () => {
        setSelectedId((prev) => (prev % pointsData.length) + 1);
    };

    const handlePrev = () => {
        setSelectedId((prev) => (prev === 1 ? pointsData.length : prev - 1));
    };


    return (
        <div className="relative w-screen h-screen overflow-hidden ibm-plex-sans 
        bg-[linear-gradient(135deg,#0B344D_0%,#062033_45%,#020B14_100%)] font-sans text-white select-none 
        flex flex-col justify-between p-4 md:p-6">

            {/* Top Header Controls */}
            <header className="absolute top-[15%] left-0 right-0 w-full px-6 md:px-12 
            flex justify-between items-center z-30 pointer-events-auto">
                <div>
                    {/* Optional Branding */}
                    {/* <div className="text-amber-500 font-semibold tracking-wider text-xs uppercase flex items-center gap-1">
      <span className="font-bold text-sm tracking-widest text-amber-400">Featherlite</span>
      <span className="text-amber-200 font-serif text-lg tracking-normal italic ml-1">SIGNATURE</span>
    </div>
    <p className="text-[10px] text-cyan-400 tracking-wider">Works for You</p> */}

                    <h1 className="text-3xl md:text-[35px] font-bold text-white/90 tracking-tight">
                        7th Floor
                    </h1>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center bg-[#0a2c47]/80 backdrop-blur-md border border-white/30 rounded-full px-3 py-1.5 shadow-lg gap-3">
                    <button
                        onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.2))}
                        className="hover:text-cyan-400 transition-colors p-1"
                        title="Zoom In"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-cyan-500/30" />
                    <button
                        onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
                        className="hover:text-cyan-400 transition-colors p-1"
                        title="Zoom Out"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main Floor Plan Canvas */}
            <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">


                <button
                    onClick={handlePrev}
                    className="absolute left-[15%] z-30 p-3 bg-slate-900/70   
                    hover:bg-slate-900/40  backdrop-blur-md border border-white/40
                     rounded-full
                         transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 shadow-xl"
                >
                    {/* <ChevronRight className="w-6 h-6 text-cyan-300" /> */}
                    <img src={left} className="w-6 h-6 text-white" />
                </button>

                {/* Scalable Vector Stage */}
                <div
                    className="relative w-full h-full max-w-[1920px]
                     flex items-center justify-center transition-transform duration-700 
                     ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    <svg
                        viewBox="0 0 2546 1432"
                        className="w-full h-full max-h-full"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Layer 1: Background Floor Plan Image */}
                        <image
                            href={image}
                            x="0"
                            y="0"
                            width="2546"
                            height="1432"
                            preserveAspectRatio="xMidYMid meet"
                            className="brightness-95 contrast-105"
                        />

                        {viewdata && (
                            <UnitPlanContentPage setSelectedId={setSelectedId} pointsData={pointsData} selectedId={selectedId} />
                        )}
                    </svg>
                </div>

                <button
                    onClick={handleNext}
                    className="absolute right-[18%] z-30 p-3 bg-slate-900/70 
                    hover:bg-slate-900/40  backdrop-blur-md border border-white/40 
                    rounded-full  transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 shadow-xl"
                >
                    {/* <ChevronRight className="w-6 h-6 text-cyan-300" /> */}
                    <img src={right} className="w-6 h-6 text-white" />
                </button>


                {/* Right Side Details Sidebar Card */}
                <UnitPlanSideContent activePoint={activePoint} setShowVRModal={setShowVRModal} viewdata={viewdata} setViewdata={setViewdata} />

            </main>


            <BackButton />

            {showVRModal && (
                <VRModel setShowVRModal={setShowVRModal} activePoint={activePoint} />

            )}
        </div>
    );
}