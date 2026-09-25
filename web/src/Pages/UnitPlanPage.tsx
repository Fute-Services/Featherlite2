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

// Per-floor 2D plans: src/assets/floorplan/2d/<floorId>.(png|jpg|webp). The card shows only for floors that have one.
const plans2d = Object.fromEntries(
    Object.entries(import.meta.glob('../assets/floorplan/2d/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' }))
        .map(([path, url]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), url as string])
);

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
    const [showPlan, setShowPlan] = useState(false);

    useEffect(() => {
        if (units.length > 0) {
            setSelectedId(units[0].id);
        }
        setPosition({ x: 0, y: 0 });
        setZoomLevel(1);
        setShowPlan(false);
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

    const plan2d = plans2d[String(floorPoints.id)] || plans2d['1'] || plans2d['12'] || Object.values(plans2d)[0];

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

            {plan2d && (
                <>
                    <button
                        onClick={() => setShowPlan(true)}
                        aria-label="Expand 2D plan"
                        className="group absolute right-4 sm:right-6 bottom-24 sm:bottom-28 z-40 w-44 sm:w-56 h-28 sm:h-36 rounded-xl overflow-hidden border-2 border-[#B8A37E]/80 shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:border-[#E6D7BA] hover:scale-105 transition-all duration-300 bg-[#04121f] cursor-pointer"
                    >
                        <img src={plan2d} alt="2D plan" className="w-full h-full object-cover bg-[#04121f] transition-transform duration-500 group-hover:scale-105" draggable={false} />
                        <span className="absolute inset-x-0 bottom-0 px-3 py-1.5 text-left text-[11px] font-bold tracking-[0.25em] text-[#E6D7BA] bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                            2D PLAN
                        </span>
                        <span className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white/90 text-xs shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">⤢</span>
                    </button>
                    {showPlan && (
                        <div onClick={() => setShowPlan(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out animate-fadeIn">
                            <div onClick={(e) => e.stopPropagation()} className="relative max-w-5xl w-full max-h-[88vh] flex items-center justify-center overflow-hidden rounded-2xl border border-[#B8A37E]/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-1.5 bg-[#04121f]">
                                <img src={plan2d} alt="2D plan full view" className="w-full h-auto max-h-[84vh] object-contain rounded-xl" />
                                <button 
                                    onClick={() => setShowPlan(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black/90 border border-white/40 rounded-full text-white transition-all cursor-pointer shadow-lg z-20"
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showVRModal && activePoint && (
                <Suspense fallback={null}>
                    <VRModel setShowVRModal={setShowVRModal} activePoint={activePoint} />
                </Suspense>
            )}
        </div>
    );
}