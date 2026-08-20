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

    // Filter out ID 101 and duplicates once with stable order
    const filteredPoints = pointsData.filter(
        (point, index, self) =>
            point.id !== 101 && index === self.findIndex((p) => p.id === point.id)
    );

    return (
        <>
            {/* Smooth Stagger Animation Definition */}
            <defs>
                <style>
                    {`
                        @keyframes singleEntrance {
                            0% {
                                opacity: 0;
                                transform: translateY(22px) scale(0.92);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                        .animate-once-entrance {
                            animation: singleEntrance 1s cubic-bezier(0.16, 1, 0.3, 1) both;
                        }
                    `}
                </style>
            </defs>

            {/* Layer 2: Connecting Lines & Target Markers */}
            <g className="pointer-events-none bg-transparent">
                {filteredPoints.map((point, index) => {
                    const isActive = point.id === selectedId;
                    const pointsList = point.points || [];
                    const startCoords = pointsList[0];

                    if (!startCoords) return null;

                    const numericId = Number(point.id);
                    const delaySeconds = !isNaN(numericId)
                        ? (numericId * 0.18).toFixed(2)
                        : (index * 0.18).toFixed(2);

                    return (
                        <g
                            key={`marker-${point.id}`}
                            className="animate-once-entrance"
                            style={{ animationDelay: `${delaySeconds}s` }}
                        >
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

            {/* Layer 3: Hotspot Cards */}
            <g className="pointer-events-auto">
                {filteredPoints.map((point, index) => {
                    const isActive = point.id === selectedId;

                    // Slower progressive entrance delay
                    const numericId = Number(point.id);
                    const delaySeconds = !isNaN(numericId)
                        ? (numericId * 0.18).toFixed(2)
                        : (index * 0.18).toFixed(2);

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
                            {/* Static Stagger Wrapper (Runs entrance once, unaffected by clicks) */}
                            <div
                                className="animate-once-entrance w-full h-full"
                                style={{ animationDelay: `${delaySeconds}s` }}
                            >
                                {/* Interactive Card (Only handles active/hover styling) */}
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
