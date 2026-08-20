import { useState, useEffect, useRef } from 'react';
import { 
    // useNavigate, 
    useParams } from 'react-router-dom';

import { pointsData } from '../Data/UnitPlanData';

// import left from '../assets/floorplan/icons/leftside.png';
// import right from '../assets/floorplan/icons/right.png';

import VRModel from '../Components/FloorPlanPages/VRModel';
import BackButton from '../Components/FloorPlanPages/BackButton';
import UnitPlanContentPage from '../Components/FloorPlanPages/UnitPlanContentPage';
import UnitPlanSideContent from '../Components/FloorPlanPages/UnitPlanSideContent';

// import { RiResetRightFill } from "react-icons/ri";
// import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function UnitPlanPage() {
    const { idnew } = useParams<{ idnew: string }>();
    // const navigate = useNavigate();

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

    const [popupInfo, setPopupInfo] = useState<{
        isOpen: boolean;
        x: number;
        y: number;
    }>({ isOpen: false, x: 0, y: 0 });

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

    // 6. Navigation Handlers
    // const currentFloorIndex = pointsData.findIndex(
    //     (floor) => String(floor.id) === String(idnew)
    // );

    // const handleNext = () => {
    //     if (pointsData.length === 0 || currentFloorIndex === -1) return;
    //     const nextIndex = (currentFloorIndex + 1) % pointsData.length;
    //     const nextFloorId = pointsData[nextIndex].id;
    //     navigate(`/unitplan/${nextFloorId}`);
    // };

    // const handlePrev = () => {
    //     if (pointsData.length === 0 || currentFloorIndex === -1) return;
    //     const prevIndex =
    //         currentFloorIndex <= 0 ? pointsData.length - 1 : currentFloorIndex - 1;
    //     const prevFloorId = pointsData[prevIndex].id;
    //     navigate(`/unitplan/${prevFloorId}`);
    // };

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

            {/* Top Header Controls (Centered Perfectly) */}
            <header
                className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center text-center transition-all duration-500 ease-out ${popupInfo.isOpen
                        ? 'opacity-0 -translate-y-4 pointer-events-none'
                        : 'opacity-100 translate-y-0'
                    }`}
            >
                <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide whitespace-nowrap">
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
            </header>
            {/* <div className="flex items-center gap-2 p-1 rounded-lg">
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
                </div> */}
            {/* </header> */}

            {/* Main Floor Plan Canvas */}
            <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
                {/* <button
                    onClick={handlePrev}
                    className="absolute left-[12%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 shadow-xl"
                    type="button"
                    title="Previous Floor"
                >
                    <img src={left} className="w-6 h-6 text-white" alt="Previous Floor" />
                </button> */}

                {/* Scalable Vector Stage with Entrance Animation Key */}
                <div
                    key={`building-stage-${idnew}`}
                    className={`relative  w-full h-full ${String(floorPoints.id) === '101'
                        ? "max-w-[1040px]"
                        : "max-w-[1920px]"
                        } flex items-center justify-center will-change-transform`}
                >
                    {/* Zoom / Pan Gesture Wrapper */}
                    <div
                        className={`relative w-full h-full flex items-center justify-center ${zoomLevel > 1 ? "cursor-grab" : "cursor-default"
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
                             {!popupInfo.isOpen && (   <image
                                    href={floorPoints.image}
                                    x="0"
                                    y="0"
                                    width={floorPoints.imagew}
                                    height={floorPoints.imageh}
                                    preserveAspectRatio="xMidYMid meet"
                                    className="brightness-95 contrast-105 bg-transparent"
                                    style={{ backgroundColor: 'transparent' }}
                                />)} 



                                {/* Polygon Hover Target */}
                                {floorPoints.polygonpopup && (
                                    <polygon
                                        points={floorPoints.polygonpopup}
                                        fill="transparent"
                                        className="cursor-pointer  transition-all duration-500 pointer-events-auto"
                                        onMouseEnter={(e) => {
                                            const bbox = e.currentTarget.getBBox();
                                            setPopupInfo({
                                                isOpen: true,
                                                x: bbox.x + bbox.width / 2,
                                                y: bbox.y,
                                            });
                                        }}
                                        onMouseLeave={() => {
                                            setPopupInfo((prev) => ({ ...prev, isOpen: false }));
                                        }}
                                    />
                                )}



                                {/* Staggered Unit Pins Group */}
                                { !popupInfo.isOpen && viewdata && units.length > 0 && (
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
                {/* 
                <button
                    onClick={handleNext}
                    className="absolute right-[16.5%] z-30 p-3 bg-slate-900/70 hover:bg-slate-900/40 backdrop-blur-md border border-white/40 rounded-full transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 shadow-xl"
                    type="button"
                    title="Next Floor"
                >
                    <img src={right} className="w-6 h-6 text-white" alt="Next Floor" />
                </button> */}

                { !popupInfo.isOpen && activePoint && (
                    <UnitPlanSideContent
                        key={`side-content-${idnew}`}
                        activePoint={activePoint}
                        setShowVRModal={setShowVRModal}
                        viewdata={viewdata}
                        setViewdata={setViewdata}
                    />
                )}
            </main>



            {/* Fullscreen Glassmorphism Hover Overlay  bg-[#020B14]/60 */}
            {popupInfo.isOpen && (
                <div className="fixed inset-0  z-[999] animate-zoom-back-to-front
      flex items-center justify-center 

   pointer-events-none transition-all duration-200 animate-in fade-in">
                    <div className="relative w-screen h-screen  flex flex-col items-center 
        
            rounded-sm 
            
           
            transition-all duration-300 transform-gpu animate-in zoom-in-95">

                        {/* Ambient Background Glow inside Card */}
                        {/* <div className="absolute inset-0 rounded-3xl   to-transparent pointer-events-none" /> */}

                        {/* Preview Image */}
                        <img
                            src={floorPoints.image}
                            alt={floorPoints.name || "Preview"}
                            className="relative z-10 w-full h-full max-w-full max-h-full object-contain"
                        />


                    </div>
                </div>
            )}

            <BackButton />

            {showVRModal && activePoint && (
                <VRModel setShowVRModal={setShowVRModal} activePoint={activePoint} />
            )}
        </div>
    );
}


// import { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

// import { pointsData } from '../Data/UnitPlanData';

// import left from '../assets/floorplan/icons/leftside.png';
// import right from '../assets/floorplan/icons/right.png';

// import VRModel from '../Components/FloorPlanPages/VRModel';
// import BackButton from '../Components/FloorPlanPages/BackButton';
// import FloorPlanViewer from '../Components/FloorPlanPages/MainFloorPlanPage';

// // import { RiResetRightFill } from "react-icons/ri";
// // import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// export default function UnitPlanPage() {
//     const { idnew } = useParams<{ idnew: string }>();
//     const navigate = useNavigate();

//     // 1. Find floor data matching URL param
//     const floorPoints = pointsData.find(
//         (floor) => String(floor.id) === String(idnew)
//     );

//     // 2. Filter units
//     const units = (floorPoints?.units || []).filter(
//         (u) => u && String(u.id) !== '0'
//     );

//     // 3. Coordinate, Zoom & Interaction States
//     const [selectedId, setSelectedId] = useState<string | number>(
//         units[0]?.id ?? ''
//     );
//     const [zoomLevel, setZoomLevel] = useState<number>(1);
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const [isDragging, setIsDragging] = useState(false);

//     const dragStart = useRef({ x: 0, y: 0 });
//     const [viewdata, setViewdata] = useState(true);
//     const [showVRModal, setShowVRModal] = useState(false);

//     // 4. Reset views whenever route ID changes
//     useEffect(() => {
//         if (units.length > 0) {
//             setSelectedId(units[0].id);
//         }
//         setPosition({ x: 0, y: 0 });
//         setZoomLevel(1);
//     }, [idnew]);

//     if (!floorPoints) {
//         return (
//             <div className="p-6 justify-center items-center flex w-screen h-screen bg-[#020B14] text-white">
//                 <BackButton />
//                 <h2 className="text-xl font-bold text-red-500 mt-4">
//                     Floor Plan Not Found
//                 </h2>
//             </div>
//         );
//     }

//     // 5. Active Unit
//     const activePoint =
//         units.find((p) => String(p.id) === String(selectedId)) || units[0];

//     // 6. Floor Carousel Navigation
//     const currentFloorIndex = pointsData.findIndex(
//         (floor) => String(floor.id) === String(idnew)
//     );

//     const handleNext = () => {
//         if (pointsData.length === 0 || currentFloorIndex === -1) return;
//         const nextIndex = (currentFloorIndex + 1) % pointsData.length;
//         const nextFloorId = pointsData[nextIndex].id;
//         navigate(`/unitplan/${nextFloorId}`);
//     };

//     const handlePrev = () => {
//         if (pointsData.length === 0 || currentFloorIndex === -1) return;
//         const prevIndex =
//             currentFloorIndex <= 0 ? pointsData.length - 1 : currentFloorIndex - 1;
//         const prevFloorId = pointsData[prevIndex].id;
//         navigate(`/unitplan/${prevFloorId}`);
//     };

//     // 7. Pan & Drag Event Handlers
//     const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
//         if (zoomLevel <= 1) return;

//         setIsDragging(true);
//         dragStart.current = {
//             x: e.clientX - position.x,
//             y: e.clientY - position.y,
//         };
//         e.currentTarget.setPointerCapture(e.pointerId);
//     };

//     const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
//         if (!isDragging) return;
//         setPosition({
//             x: e.clientX - dragStart.current.x,
//             y: e.clientY - dragStart.current.y,
//         });
//     };

//     const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
//         setIsDragging(false);
//         if (e.currentTarget.hasPointerCapture(e.pointerId)) {
//             e.currentTarget.releasePointerCapture(e.pointerId);
//         }
//     };

//     return (
//         <div className="relative w-screen h-screen overflow-hidden ibm-plex-sans
//         bg-[linear-gradient(135deg,#0B344D_0%,#062033_45%,#020B14_100%)] text-white
//         select-none flex flex-col justify-between p-4 md:p-6">

//             {/* Top Header Controls */}
//             <header className="absolute top-4  left-[32%] px-6 md:px-8 flex justify-between
//             items-start z-30 pointer-events-auto">
//                 <div className="w-32 hidden md:block pointer-events-none" />

//                 <div className="flex flex-col items-center text-center mx-auto">
//                     <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide">
//                         {floorPoints.name}
//                     </h1>

//                     {String(floorPoints.id) !== '2' && (
//                         <>
//                             <div className="w-48 md:w-56 border-b border-[#a88248]/60 my-1.5" />
//                             <p className="text-xs md:text-[11px] text-slate-300 tracking-wider font-light">
//                                 Explore thoughtfully planned spaces
//                             </p>
//                         </>
//                     )}
//                 </div>

//                 <div className="flex items-center gap-2 p-1 rounded-lg">
//                     {/* <button
//                         onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
//                         className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
//                         title="Zoom In"
//                         type="button"
//                     >
//                         <ZoomIn className="w-4 h-4" />
//                     </button>

//                     <button
//                         onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
//                         className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
//                         title="Zoom Out"
//                         type="button"
//                     >
//                         <ZoomOut className="w-4 h-4" />
//                     </button>

//                     <button
//                         onClick={() => {
//                             setZoomLevel(1);
//                             setPosition({ x: 0, y: 0 });
//                         }}
//                         className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
//                         title="Reset View"
//                         type="button"
//                     >
//                         <RiResetRightFill className="w-4 h-4" />
//                     </button>

//                     <button
//                         onClick={() => {
//                             if (!document.fullscreenElement) {
//                                 document.documentElement.requestFullscreen();
//                             } else if (document.exitFullscreen) {
//                                 document.exitFullscreen();
//                             }
//                         }}
//                         className="flex items-center justify-center w-10 h-10 bg-[#08263e]/80 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg border border-white/10 transition-all duration-300"
//                         title="Toggle Fullscreen"
//                         type="button"
//                     >
//                         <Maximize2 className="w-4 h-4" />
//                     </button> */}
//                 </div>
//             </header>

//             {/* Floor Plan Viewer Canvas with Zoom Lens */}
//             <FloorPlanViewer
//                 floorPoints={floorPoints}
//                 units={units}
//                 selectedId={selectedId}
//                 setSelectedId={setSelectedId}
//                 activePoint={activePoint}
//                 setShowVRModal={setShowVRModal}
//                 viewdata={viewdata}
//                 setViewdata={setViewdata}
//                 handlePrev={handlePrev}
//                 handleNext={handleNext}
//                 idnew={idnew}
//                 zoomLevel={zoomLevel}
//                 isDragging={isDragging}
//                 position={position}
//                 handlePointerDown={handlePointerDown}
//                 handlePointerMove={handlePointerMove}
//                 handlePointerUp={handlePointerUp}
//                 left={left}
//                 right={right}
//             />

//             <BackButton />

//             {showVRModal && activePoint && (
//                 <VRModel setShowVRModal={setShowVRModal} activePoint={activePoint} />
//             )}
//         </div>
//     );
// }
