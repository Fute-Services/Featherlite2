import  { useMemo } from 'react';

interface UnitPlanContentPageProps {
    setSelectedId: (id: string | number) => void;
    pointsData: any[];
    selectedId: string | number;
}

export default function UnitPlanContentPage({
    setSelectedId,
    pointsData = [],
    selectedId,
}: UnitPlanContentPageProps) {
    if (!pointsData || pointsData.length === 0) return null;

    // Filter out ID 101 and duplicate entries
    const filteredPoints = useMemo(() => {
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
                            animation: singleEntrance 2s cubic-bezier(0.18, 1, 0.5, 1) both;
                        }
                    `}
                </style>
            </defs>

            {/* Layer 2: Connecting Lines & Target Markers (Static) */}
            <g className="pointer-events-none bg-transparent">
                {filteredPoints.map((point) => {
                    const isActive = point.id === selectedId;
                    const pointsList = point.points || [];
                    const startCoords = pointsList[0];

                    if (!startCoords) return null;

                    return (
                        <g key={`marker-${point.id}`}>
                            <polyline
                                points={pointsList.map((p: any) => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke={isActive ? '#c89d52' : 'rgba(200, 157, 82, 0.45)'}
                                strokeWidth={isActive ? '2' : '1.2'}
                                vectorEffect="non-scaling-stroke"
                                className="transition-colors duration-300 ease-out"
                            />

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

            {/* Layer 3: Hotspot Cards (Left Column Top-to-Bottom, then Right Column Top-to-Bottom) */}
            <g className="pointer-events-auto">
                {filteredPoints.map((point) => {
                    const isActive = point.id === selectedId;

                    // Retrieve sequence index based on position ordering
                    const sequenceIndex = animationOrderMap.get(point.id) ?? 0;
                    const delaySeconds = (sequenceIndex * 0.32).toFixed(2);

                    return (
                        <foreignObject
                            key={`card-${point.id}`}
                            x={(point.labelX ?? 0) - 120}
                            y={(point.labelY ?? 0) - 50}
                            width="270"
                            height="190"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(point.id);
                            }}
                            className="overflow-visible pointer-events-auto"
                            style={{ zIndex: isActive ? 50 : 10 }}
                        >
                            {/* Staggered entrance wrapper */}
                            <div
                                className="animate-once-entrance w-full h-full"
                                style={{ animationDelay: `${delaySeconds}s` }}
                            >
                                <div
                                    className={`w-full py-5 px-4 rounded-xl border 
                                    transition-all duration-500 ease-out
                                    transform-gpu cursor-pointer shadow-2xl ${
                                        isActive
                                            ? 'bg-[#082842] border-white/60 shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105 opacity-100'
                                            : 'bg-[#051a2d] border-white/40 hover:border-[#a17834] opacity-90 hover:opacity-100 hover:scale-[1.02]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#a17834] text-[16px] text-white/90 font-mono font-bold">
                                            {point.id}
                                        </span>
                                        <h3 className="text-[17px] font-semibold text-white tracking-wide truncate">
                                            {point.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        {point.icon && (
                                            <img
                                                src={point.icon}
                                                className="w-6 h-6 shrink-0"
                                                alt=""
                                            />
                                        )}
                                        <p className="text-[16px] text-slate-300 mt-1 leading-tight line-clamp-2">
                                            {point.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </foreignObject>
                    );
                })}
            </g>
        </>
    );
}