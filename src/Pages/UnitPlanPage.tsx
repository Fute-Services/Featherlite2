import { useState } from 'react';

import { pointsData } from '../Data/UnitPlanData'

import left from '../assets/floorplan/icons/leftside.png';
import right from '../assets/floorplan/icons/right.png'

import VRModel from '../components/FloorPlanPages/VRModel';
import BackButton from '../components/FloorPlanPages/BackButton';
import UnitPlanContentPage from '../components/FloorPlanPages/UnitPlanContentPage';
import UnitPlanSideContent from '../components/FloorPlanPages/UnitPlanSideContent';
import { useParams } from 'react-router-dom';
import { FLOORS } from '../Data/FloorPlanData'
import { Search } from 'lucide-react';
import { Plus, Minus, Expand } from 'lucide-react';
import { FaChevronRight } from "react-icons/fa";
import { RiResetRightFill } from "react-icons/ri";


import { FaAngleLeft } from "react-icons/fa6";

import { ZoomIn, ZoomOut, Target, Maximize2 } from 'lucide-react';


export default function UnitPlanPage() {
    const { idnew } = useParams<{ idnew: string }>();

    // Find corresponding floor data matching numeric or string ID
    const floorPoints = pointsData.find(
        (floor) => String(floor.id) === idnew
    );

    if (!floorPoints) {
        return (
            <div className="p-6 justify-center items-center flex w-screen h-screen">
                <BackButton />
                <h2 className="text-xl font-bold text-red-500 mt-4">Floor Plan Not Found</h2>
            </div>
        );
    }

    const [selectedId, setSelectedId] = useState<number>(1);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [viewdata, setViewdata] = useState(true);
    const [showVRModal, setShowVRModal] = useState(false);

    // Get units array for the matched floor (fallback to empty array if undefined)
    const units = floorPoints?.units || [];

    // 1. Find the currently active unit on this floor
    const activePoint = units.find((p) => p.id === selectedId) || units[0];

    // 2. Next / Prev handlers cycle through the current floor's units
    const handleNext = () => {
        if (units.length === 0) return;
        setSelectedId((prev) => {
            const currentIndex = units.findIndex((u) => u.id === prev);
            const nextIndex = (currentIndex + 1) % units.length;
            return units[nextIndex].id;
        });
    };

    const handlePrev = () => {
        if (units.length === 0) return;
        setSelectedId((prev) => {
            const currentIndex = units.findIndex((u) => u.id === prev);
            const prevIndex = currentIndex <= 0 ? units.length - 1 : currentIndex - 1;
            return units[prevIndex].id;
        });
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden ibm-plex-sans 
        bg-[linear-gradient(135deg,#0B344D_0%,#062033_45%,#020B14_100%)] text-white select-none 
        flex flex-col justify-between p-4 md:p-6">

            {/* Top Header Controls */}
            {/* Top Header Controls */}
            <header className="absolute top-4 left-0 right-3 px-6 md:px-8 flex justify-between 
            items-start z-30 pointer-events-auto">

                {/* Left Empty Spacer for Flex Alignment Balance */}
                <div className="w-32 hidden md:block pointer-events-none" />

                {/* Center Title with Border and Subtitle */}
                <div className="flex flex-col items-center text-center mx-auto">
                    <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide">
                        {floorPoints.name}
                    </h1>
                    {/* Underline Divider */}
                    <div className="w-48 md:w-56 border-b border-[#a88248]/60 my-1.5" />
                    <p className="text-xs md:text-[11px] text-slate-300 tracking-wider font-light">
                        Explore thoughtfully planned spaces
                    </p>
                </div>

                {/* Right Side Horizontal Control Bar */}
                <div className="flex items-center gap-2 p-1  rounded-lg ">

                    {/* 1. Zoom In */}
                    <button
                        onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10
                         text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* 2. Zoom Out */}
                    <button
                        onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10
                         text-slate-200 hover:text-white  rounded-lg border border-white/10 transition-all duration-300"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>

                    {/* 3. Reset / Center View */}
                    <button
                        onClick={() => setZoomLevel(1)}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80
                        hover:bg-white/10
                         text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
                        title="Reset View"
                    >
                        <RiResetRightFill  className="w-4 h-4" />
                    </button>

                    {/* 4. Toggle Fullscreen */}
                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else if (document.exitFullscreen) {
                                document.exitFullscreen();
                            }
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 
                       hover:bg-white/10
                         text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
                        title="Toggle Fullscreen"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </header>




            {/* Main Floor Plan Canvas */}
            <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">


                <button
                    onClick={handlePrev}
                    className="absolute left-[12%] z-30 p-3 bg-slate-900/70   
                    hover:bg-slate-900/40  backdrop-blur-md border border-white/40
                     rounded-full
                         transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 shadow-xl"
                >
                    <FaAngleLeft className="w-5 h-5  text-white" />
                    {/* <img src={left} className="w-6 h-6 text-white" /> */}
                </button>

                {/* Scalable Vector Stage */}
                <div
                    className="relative w-full h-full max-w-[1920px]
                     flex items-center justify-center transition-transform duration-700 
                     ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    <svg
                        viewBox={floorPoints.imagesvg}
                        className="w-full h-full max-h-full"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Layer 1: Background Floor Plan Image */}
                        <image
                            href={floorPoints.image}
                            x="0"
                            y="0"
                            width={floorPoints.imagew}
                            height={floorPoints.imageh}
                            preserveAspectRatio="xMidYMid meet"
                            // className="brightness-95 contrast-105"
                            className="brightness-95 contrast-105 bg-transparent"
                            style={{ backgroundColor: 'transparent' }}
                        />


                        {viewdata && floorPoints?.units && (

                            <UnitPlanContentPage
                                setSelectedId={setSelectedId}
                                pointsData={floorPoints.units} // <-- Must pass .units array here!
                                selectedId={selectedId}
                            />
                        )}
                    </svg>
                </div>

                <button
                    onClick={handleNext}
                    className="absolute right-[16.5%] z-30 p-3 bg-slate-900/70 
                    hover:bg-slate-900/40  backdrop-blur-md border border-white/40 
                    rounded-full  transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 shadow-xl"
                >
                    <FaChevronRight  className="w-4.5 h-4.5 text-white" />
                    {/* <img src={right} className="w-6 h-6 text-white" /> */}
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