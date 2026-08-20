import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { pointsData } from '../Data/UnitPlanData';


import VRModel from '../Components/FloorPlanPages/VRModel';
import BackButton from '../Components/FloorPlanPages/BackButton';
import UnitPlanContentPage from '../Components/FloorPlanPages/UnitPlanContentPage';
import UnitPlanSideContent from '../Components/FloorPlanPages/UnitPlanSideContent';

import { RiResetRightFill } from "react-icons/ri";
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function UnitPlanPage() {
    const { idnew } = useParams<{ idnew: string }>();

    // 1. Find corresponding floor data matching ID
    const floorPoints = pointsData.find(
        (floor) => String(floor.id) === String(idnew)
    );

    // 2. Filter units (ignoring floor ID 1)
    const units = (floorPoints?.units || []).filter(
        (u) => u && String(u.id) !== '0'
    );

    // 3. States
    const [selectedId, setSelectedId] = useState<string | number>(
        units[0]?.id ?? 0
    );
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const dragStart = useRef({ x: 0, y: 0 });
    const [viewdata, setViewdata] = useState(true);
    const [showVRModal, setShowVRModal] = useState(false);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleImageMouseEnter = () => {
        if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
        setIsImageHovered(true);
    };
    const handleImageMouseLeave = () => {
        hoverLeaveTimer.current = setTimeout(() => setIsImageHovered(false), 150);
    };

    // 4. Reset selected unit and pan/zoom whenever floor (idnew) changes
    useEffect(() => {
        if (units.length > 0) {
            setSelectedId(units[0].id);
        }
        setPosition({ x: 0, y: 0 });
        setZoomLevel(1);
    }, [idnew]);

    if (!floorPoints) {
        return (
            <div className="p-6 justify-center items-center flex w-screen h-screen bg-[#020B14] text-white">
                <BackButton />
                <h2 className="text-xl font-bold text-red-500 mt-4">
                    Floor Plan Not Found
                </h2>
            </div>
        );
    }

    // 5. Derive active unit safely
    const activePoint =
        units.find((p) => String(p.id) === String(selectedId)) || units[0];

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (zoomLevel <= 1) return;

        setIsDragging(true);

        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden ibm-plex-sans 
        bg-[linear-gradient(135deg,#0B344D_0%,#062033_45%,#020B14_100%)] text-white 
        select-none 
        flex flex-col justify-between p-4 md:p-6">

            {/* Top Header Controls */}
            <header className="absolute top-4 left-0 right-3 px-6 md:px-8 flex justify-between 
            items-start z-30 pointer-events-auto">
                <div className="w-32 hidden md:block pointer-events-none" />

                <div className="flex flex-col items-center text-center mx-auto">
                    <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide">
                        {floorPoints.name}
                    </h1>

                    {String(floorPoints.id) !== '2' && (
                        <>
                            <div className="w-48 md:w-56 border-b border-[#a88248]/60 my-1.5" />
                            <p className="text-xs md:text-[11px] text-slate-300 tracking-wider font-light">
                                Explore thoughtfully planned spaces
                            </p>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 p-1 rounded-lg">
                    <button
                        onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
                        title="Zoom In"
                        type="button"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
                        title="Zoom Out"
                        type="button"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => {
                            setZoomLevel(1);
                            setPosition({ x: 0, y: 0 });
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
                        title="Reset View"
                        type="button"
                    >
                        <RiResetRightFill className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else if (document.exitFullscreen) {
                                document.exitFullscreen();
                            }
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
                        title="Toggle Fullscreen"
                        type="button"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main Floor Plan Canvas */}
            <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
                {/* Scalable Vector Stage with Entrance Animation Key */}
                <div
                    key={`building-stage-${idnew}`}
                    className={`relative animate-zoom-back-to-front w-full h-full ${
                        String(floorPoints.id) === '101'
                            ? "max-w-[1040px]"
                            : "max-w-[1920px]"
                    } flex items-center justify-center will-change-transform`}
                >
                    {/* Zoom / Pan Gesture Wrapper */}
                    <div
                        className={`relative w-full h-full flex items-center justify-center ${
                            zoomLevel > 1 ? "cursor-grab" : "cursor-default"
                        } ${isDragging ? "cursor-grabbing" : ""}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        <div
                            className="relative w-full h-full flex items-center justify-center will-change-transform"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                                transformOrigin: "center center",
                                transition: isDragging ? "none" : "transform 500ms ease-out",
                            }}
                        >
                            <svg
                                key={`floor-svg-${idnew}`}
                                viewBox={floorPoints.imagesvg}
                                className="w-full h-full max-h-full"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <image
                                    href={floorPoints.image}
                                    x="0"
                                    y="0"
                                    width={floorPoints.imagew}
                                    height={floorPoints.imageh}
                                    preserveAspectRatio="xMidYMid meet"
                                    className="brightness-95 contrast-105 bg-transparent cursor-pointer"
                                    style={{ backgroundColor: 'transparent' }}
                                    onMouseEnter={handleImageMouseEnter}
                                    onMouseLeave={handleImageMouseLeave}
                                />

                                {/* Staggered Unit Pins Group */}
                                {viewdata && units.length > 0 && (
                                    <g 
                                        key={`unit-group-${idnew}`}
                                        className="animate-unit-pins-delayed"
                                    >
                                        <UnitPlanContentPage
                                            setSelectedId={setSelectedId}
                                            pointsData={units}
                                            selectedId={selectedId}
                                        />
                                    </g>
                                )}
                            </svg>
                        </div>
                    </div>
                </div>

                {activePoint && (
                    <UnitPlanSideContent
                        key={`side-content-${idnew}`}
                        activePoint={activePoint}
                        setShowVRModal={setShowVRModal}
                        viewdata={viewdata}
                        setViewdata={setViewdata}
                    />
                )}
            </main>

            <BackButton />

            {showVRModal && activePoint && (
                <VRModel setShowVRModal={setShowVRModal} activePoint={activePoint} />
            )}

            {/* Hover Preview: enlarged floor image */}
            <AnimatePresence>
                {isImageHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-40 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 12 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/60 p-1 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)]"
                        >
                            <img
                                src={floorPoints.image}
                                alt={floorPoints.name ?? 'Floor Preview'}
                                decoding="async"
                                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}