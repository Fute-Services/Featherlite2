import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface UnitPlanContentPageProps {
    setSelectedId: (id: string | number) => void;
    pointsData: any[];
    selectedId: string | number;
}

function getVrSceneForUnit(name: string = '', vrSceneProp?: string): string | null {
    if (vrSceneProp) return vrSceneProp;
    const lower = name.toLowerCase();

    if (lower.includes('lift lobby')) return 'int_lift_lobby';
    if (lower.includes('office space') || lower.includes('workstation')) return 'int_workstation_1';
    if (lower.includes('court') || lower.includes('multipurpose')) return 'ext_multipurpose_court';
    if (lower.includes('reception')) return 'int_reception_lobby';
    if (lower.includes('terrace cafe') || lower.includes('cafe 1') || lower.includes('cafe 2')) return 'ext_terrace_cafe_1';
    if (lower.includes('cafe') || lower.includes('waiting')) return 'int_gf_cafe_waiting';
    if (lower.includes('seating')) return 'ext_open_seating';
    if (lower.includes('play area') || lower.includes('kids')) return 'ext_kids_play_area';
    if (lower.includes('plaza') || lower.includes('arrival') || lower.includes('drop off')) return 'ext_drop_off_area';
    if (lower.includes('entry gate') || lower.includes('gate')) return 'ext_entry_gate';

    return null;
}

export default function UnitPlanContentPage({
    setSelectedId,
    pointsData = [],
    selectedId,
}: UnitPlanContentPageProps) {
    const navigate = useNavigate();

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

    // Cards left of the centre grow leftwards (away from the building); right-hand cards grow rightwards.
    const midLabelX = useMemo(() => {
        const xs = filteredPoints.map((p) => p.labelX ?? 0);
        return xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : 0;
    }, [filteredPoints]);

    // Horizontal nudge away from the building so cards don't sit on its edge.
    const cardOffsetX = (p: any) => ((p.labelX ?? 0) <= midLabelX ? -40 : 90);

    // Cards in the same column must not overlap: sort by Y and push down any card
    // that would sit on top of the one above it (heights are estimates in SVG units).
    const adjustedLabelY = useMemo(() => {
        const estHeight = (p: any) =>
            (getVrSceneForUnit(p.name, p.vrScene) ? 240 : 175) +
            ((p.name?.length ?? 0) > 24 ? 36 : 0) +
            ((p.subtitle?.length ?? 0) > 40 ? 32 : 0);
        const GAP = 28;
        const result = new Map<string | number, number>();
        const sorted = [...filteredPoints].sort((a, b) => (a.labelY ?? 0) - (b.labelY ?? 0));
        const placed: { x: number; y: number; h: number }[] = [];
        sorted.forEach((p) => {
            const x = p.labelX ?? 0;
            let y = p.labelY ?? 0;
            const h = estHeight(p);
            placed
                .filter((q) => Math.abs(q.x - x) < 500)
                .sort((a, b) => a.y - b.y)
                .forEach((q) => {
                    if (y < q.y + q.h + GAP && y + h > q.y) y = q.y + q.h + GAP;
                });
            placed.push({ x, y, h });
            result.set(p.id, y);
        });
        return result;
    }, [filteredPoints]);

    if (!pointsData || pointsData.length === 0) return null;

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
                    const basePoints = point.points || [];
                    const shift = (adjustedLabelY.get(point.id) ?? point.labelY ?? 0) - (point.labelY ?? 0);
                    const lastPt = basePoints[basePoints.length - 1];
                    const dx = cardOffsetX(point);
                    const pointsList = lastPt
                        ? [
                            ...basePoints,
                            ...(shift > 0 ? [{ x: lastPt.x, y: lastPt.y + shift }] : []),
                            { x: lastPt.x + dx, y: lastPt.y + (shift > 0 ? shift : 0) },
                        ]
                        : basePoints;
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
                    const vrSceneTarget = getVrSceneForUnit(point.name, point.vrScene);
                    const hasVrButton = Boolean(vrSceneTarget);

                    // Retrieve sequence index based on position ordering
                    const sequenceIndex = animationOrderMap.get(point.id) ?? 0;
                    const delaySeconds = (sequenceIndex * 0.32).toFixed(2);

                    return (
                        <foreignObject
                            key={`card-${point.id}`}
                            x={(point.labelX ?? 0) - 150 - ((point.labelX ?? 0) <= midLabelX ? 170 : 0) + cardOffsetX(point)}
                            y={(adjustedLabelY.get(point.id) ?? point.labelY ?? 0) - 50}
                            width="500"
                            height={hasVrButton ? "380" : "320"}
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
                                    className={`w-full py-6 px-6 rounded-xl border 
                                    transition-all duration-500 ease-out
                                    transform-gpu cursor-pointer shadow-2xl ${isActive
                                            ? 'bg-[#082842] border-white/60 shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105 opacity-100'
                                            : 'bg-[#051a2d] border-white/40 hover:border-[#a17834] opacity-90 hover:opacity-100 hover:scale-[1.02]'
                                        }`}
                                >
                                    <div className="flex items-start gap-2 mb-1.5">
                                        <span className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full border-2 border-[#a17834] text-[22px] text-white/90 font-mono font-bold mt-0.5">
                                            {point.id}
                                        </span>
                                        <h3 className="text-[24px] sm:text-[26px] font-semibold text-white tracking-wide leading-snug">
                                            {point.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        {point.icon && (
                                            typeof point.icon === 'string' ? (
                                                <img
                                                    src={point.icon}
                                                    className="w-9 h-9 shrink-0 object-contain mt-0.5"
                                                    alt={point.name || 'icon'}
                                                />
                                            ) : (
                                                <point.icon className="w-9 h-9 shrink-0 text-white/90 mt-0.5" />
                                            )
                                        )}

                                        <p className="text-[22px] text-slate-300 leading-tight line-clamp-2">
                                            {point.subtitle}
                                        </p>
                                    </div>

                                    {hasVrButton && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/vr-tour?scene=${vrSceneTarget}`);
                                            }}
                                            className="mt-3.5 flex items-center justify-center gap-1.5 w-full py-2.5 px-3 bg-gradient-to-r from-amber-600/90 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 border border-amber-300/50 rounded-lg text-[19px] font-semibold text-white tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
                                        >
                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                                                <path d="m3.3 7 8.7 5 8.7-5"/>
                                                <path d="M12 22V12"/>
                                            </svg>
                                            Go to VR
                                        </button>
                                    )}
                                </div>
                            </div>
                        </foreignObject>
                    );
                })}
            </g>
        </>
    );
}