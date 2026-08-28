import { useMemo } from 'react';

interface UnitPlanPopupOverlayProps {
    pointsData: any[];
    selectedId?: string | number;
}

export default function UnitPlanPopupOverlay({
    pointsData = [],
    selectedId,
}: UnitPlanPopupOverlayProps) {
    // Filter out ID 101 and duplicate entries
    const filteredPoints = useMemo(() => {
        if (!pointsData) return [];
        return pointsData.filter(
            (point, index, self) =>
                point.id !== 101 && index === self.findIndex((p) => p.id === point.id)
        );
    }, [pointsData]);

    // Compute left-to-right, column-by-column, top-to-bottom sequence map
    const animationOrderMap = useMemo(() => {
        if (filteredPoints.length === 0) return new Map<string | number, number>();

        // Find mid-point along the X-axis to split columns
        const xValues = filteredPoints.map((p) => p.labelX ?? 0);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const midX = (minX + maxX) / 2;

        // Separate points into left and right columns
        const leftColumn = filteredPoints.filter((p) => (p.labelX ?? 0) <= midX);
        const rightColumn = filteredPoints.filter((p) => (p.labelX ?? 0) > midX);

        // Sort each column top-to-bottom by Y coordinate
        leftColumn.sort((a, b) => (a.labelY ?? 0) - (b.labelY ?? 0));
        rightColumn.sort((a, b) => (a.labelY ?? 0) - (b.labelY ?? 0));

        // Concatenate: Complete left column first, then right column
        const ordered = [...leftColumn, ...rightColumn];

        // Map point.id -> sequential animation index
        const orderMap = new Map<string | number, number>();
        ordered.forEach((point, seqIndex) => {
            orderMap.set(point.id, seqIndex);
        });

        return orderMap;
    }, [filteredPoints]);

    // Bail out *after* the hooks. An early return above them changes the hook
    // count between renders, which React answers with a hard crash the moment a
    // floor plan swaps to a plate that carries no points.
    if (filteredPoints.length === 0) return null;

    return (
        <>
            {/* Smooth Stagger Animation Definition */}
            <defs>
                <style>
                    {`
                        @keyframes singleEntrance {
                            0% {
                                opacity: 0;
                                transform: translateY(24px) scale(0.94);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                        .animate-once-entrance {
                            animation: singleEntrance 1.8s cubic-bezier(0.18, 1, 0.5, 1) both;
                        }
                    `}
                </style>
            </defs>

            {/* Layer 1: Connecting Lines & Target Markers */}
            <g className="pointer-events-none bg-transparent">
                {filteredPoints.map((point) => {
                    const isActive = point.id === selectedId;
                    const pointsList = point.points || [];
                    const startCoords = pointsList[0];

                    if (!startCoords) return null;

                    return (
                        <g key={`popup-marker-${point.id}`}>
                            {/* Connecting Polyline */}
                            <polyline
                                points={pointsList.map((p: any) => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke={isActive ? '#c89d52' : 'rgba(200, 157, 82, 0.65)'}
                                strokeWidth={isActive ? '2' : '1.2'}
                                vectorEffect="non-scaling-stroke"
                                className="transition-colors duration-300 ease-out"
                            />

                            {/* Active Rings */}
                            {isActive && (
                                <>
                                    <circle
                                        cx={startCoords.x}
                                        cy={startCoords.y}
                                        r="24"
                                        fill="rgba(245, 158, 11, 0.15)"
                                        stroke="#c89d52"
                                        strokeWidth="1"
                                        strokeOpacity="0.6"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                    <circle
                                        cx={startCoords.x}
                                        cy={startCoords.y}
                                        r="28"
                                        fill="none"
                                        stroke="#f59e0b"
                                        strokeWidth="1"
                                        vectorEffect="non-scaling-stroke"
                                        className="animate-ping opacity-40"
                                    />
                                </>
                            )}

                            {!isActive && (
                                <circle
                                    cx={startCoords.x}
                                    cy={startCoords.y}
                                    r="14"
                                    fill="none"
                                    stroke="rgba(200, 157, 82, 0.5)"
                                    strokeWidth="1"
                                    vectorEffect="non-scaling-stroke"
                                />
                            )}

                            {/* Target Node */}
                            <circle
                                cx={startCoords.x}
                                cy={startCoords.y}
                                r={isActive ? '10' : '6'}
                                fill={isActive ? '#fff3d1' : '#c89d52'}
                                stroke={isActive ? '#f1b752' : '#a17834'}
                                strokeWidth={isActive ? '2' : '1.5'}
                                vectorEffect="non-scaling-stroke"
                                className="transition-all duration-300 ease-out shadow-lg"
                                style={{
                                    filter: isActive
                                        ? 'drop-shadow(0px 0px 8px rgba(245, 158, 11, 0.9))'
                                        : 'none',
                                }}
                            />
                        </g>
                    );
                })}
            </g>

            {/* Layer 2: Hotspot Badges (ID + Name + Coordinates, Static/No Click) */}
            <g className="pointer-events-none">
                {filteredPoints.map((point) => {
                    const isActive = point.id === selectedId;
                    // const pointsList = point.points || [];
                    // const startCoords = pointsList[0] || {
                    //     x: point.labelX ?? 0,
                    //     y: point.labelY ?? 0,
                    // };

                    // Retrieve sequence index based on position ordering
                    const sequenceIndex = animationOrderMap.get(point.id) ?? 0;
                    const delaySeconds = (sequenceIndex * 0.28).toFixed(2);

                    return (
                        <foreignObject
                            key={`popup-card-${point.id}`}
                            x={(point.labelX ?? 0) - 125}
                            y={(point.labelY ?? 0) - 30}
                            width="290"
                            height="110"
                            className="overflow-visible pointer-events-none"
                            style={{ zIndex: isActive ? 50 : 10 }}
                        >
                            {/* Staggered entrance wrapper animate-once-entrance*/}
                            <div
                                className=" w-full h-full"
                                style={{ animationDelay: `${delaySeconds}s` }}
                            >
                                <div
                                    className={`w-full py-5 px-4 rounded-xl border backdrop-blur-md transition-all duration-500 ease-out shadow-2xl ${isActive
                                            ? 'bg-[#082842]/95 border-white/60 shadow-[0_0_25px_rgba(56,189,248,0.45)] scale-105 opacity-100'
                                            : 'bg-[#051a2d]/90 border-white/40 opacity-90'
                                        }`}
                                >
                                    {/* Name and ID Header */}
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center
                                         shrink-0 w-8 h-8 rounded-full border-2 
                                         border-[#a17834] text-[18px] text-white/90 font-mono font-bold">
                                            {point.id}
                                        </span>
                                        <h3 className="text-[20px] font-semibold text-white tracking-wide truncate">
                                            {point.name ? point.name.replace(/\s*\(.*?\)/g, '').trim() : ''}
                                        </h3>
                                    </div>

                                    {/* Coordinate Display 
                                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-300/90 mt-1.5 pt-1.5 border-t border-white/10 tracking-wider">
                                        <span>X: {Math.round(startCoords.x)}</span>
                                        <span>Y: {Math.round(startCoords.y)}</span>
                                    </div>*/}
                                </div>
                            </div>
                        </foreignObject>
                    );
                })}
            </g>
        </>
    );
}