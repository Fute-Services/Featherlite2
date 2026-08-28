import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
    // useNavigate,
    useParams
} from 'react-router-dom';

import { pointsData } from '../Data/UnitPlanData';

// import left from '../assets/floorplan/icons/leftside.png';
// import right from '../assets/floorplan/icons/right.png';

const VRModel = lazy(() => import('../Components/FloorPlanPages/VRModel'));
import BackButton from '../Components/FloorPlanPages/BackButton';
import UnitPlanContentPage from '../Components/FloorPlanPages/UnitPlanContentPage';
// import UnitPlanPopupOverlay from '../Components/FloorPlanPages/UnitPlanPopupOverlay';

export default function UnitPlanPage() {
    const { idnew } = useParams<{ idnew: string }>();

    const floorPoints = pointsData.find(
        (floor) => String(floor.id) === String(idnew)
    );

    const units = (floorPoints?.units || []).filter(
        (u) => u && String(u.id) !== '0'
    );

    const [selectedId, setSelectedId] = useState<string | number>(
        units[0]?.id ?? 0
    );
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const dragStart = useRef({ x: 0, y: 0 });
    const [viewdata] = useState(true);
    const [showVRModal, setShowVRModal] = useState(false);

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
        <div className="relative w-screen h-screen overflow-hidden ibm-plex-sans bg-[linear-gradient(135deg,#0B344D_0%,#062033_45%,#020B14_100%)] text-white select-none flex flex-col justify-between p-4 pb-24 md:p-6 md:pb-28">

            {/* Top Header */}
            <header
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
                className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center text-center transition-all duration-500 ease-out opacity-100 translate-y-0"
            >
                {/* <h1 className="text-3xl md:text-4xl font-semibold tracking-wide whitespace-nowrap
  bg-gradient-to-r from-[#B7B694] via-[#D4AF37] to-[#F5E6A8]
  bg-clip-text text-transparent drop-shadow-lg">
                    {floorPoints.name}
                </h1> */}
                {/* <h1 className="text-3xl md:text-4xl font-semibold tracking-wide whitespace-nowrap
  bg-gradient-to-l from-[#FFF1B8] via-[#E0C15A] to-[#FFF1B8]
  bg-clip-text text-transparent">
  {floorPoints.name}
</h1> */}

                <h1 className="text-3xl md:text-4xl font-semibold tracking-wide leading-tight whitespace-nowrap
  bg-gradient-to-l from-[#E6D7BA] via-[#B8A37E] to-[#E6D7BA]
  bg-clip-text text-transparent">
                    {floorPoints.name}
                </h1>

                        {/* <h1 className="text-3xl md:text-4xl font-semibold tracking-wide whitespace-nowrap
  bg-gradient-to-l from-[#E8DCBF] via-[#A89269] to-[#E8DCBF]
  bg-clip-text text-transparent">
                    {floorPoints.name}
                </h1> */}

                {/* <h1 className="text-3xl md:text-4xl font-semibold tracking-wide whitespace-nowrap
  bg-gradient-to-l from-[#FFF6E3] via-[#D1BD96] to-[#FFF6E3]
  bg-clip-text text-transparent">
  {floorPoints.name}
</h1> */}

                {String(floorPoints.id) !== '2' && (
                    <>
                        <div className="w-48 md:w-56 border-b border-[#a88248]/60 my-1.5" />
                        <p className="text-xs md:text-[11px] text-slate-300 tracking-wider font-light">
                            Explore thoughtfully planned spaces
                        </p>
                    </>
                )}
            </header>

            {/* Main Floor Plan Canvas */}
            <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28">
                <div
                    key={`building-stage-${idnew}`}
                    className={`relative w-full h-full ${String(floorPoints.id) === '101'
                        ? 'max-w-[1040px]'
                        : 'max-w-[1920px]'
                        } flex items-center justify-center will-change-transform`}
                >
                    <div
                        className={`relative w-full h-full flex items-center justify-center ${zoomLevel > 1 ? 'cursor-grab' : 'cursor-default'
                            } ${isDragging ? 'cursor-grabbing' : ''}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        <div
                            className="relative w-full h-full flex items-center justify-center will-change-transform"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                                transformOrigin: 'center center',
                                transition: isDragging ? 'none' : 'transform 500ms ease-out',
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
                                    className="brightness-95 contrast-105 bg-transparent"
                                    style={{ backgroundColor: 'transparent' }}
                                />

                                {/* Main View Hotspot Pins */}
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

                {/* {!popupInfo.isOpen && activePoint && (
                    <UnitPlanSideContent
                        key={`side-content-${idnew}`}
                        activePoint={activePoint}
                        setShowVRModal={setShowVRModal}
                        viewdata={viewdata}
                        setViewdata={setViewdata}
                    />
                )} */}
            </main>
            <BackButton />

            {showVRModal && activePoint && (
                <Suspense fallback={null}>
                    <VRModel setShowVRModal={setShowVRModal} activePoint={activePoint} />
                </Suspense>
            )}
        </div>
    );
}