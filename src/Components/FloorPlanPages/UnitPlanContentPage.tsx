interface UnitPlanContentPageProps {
    setSelectedId: React.Dispatch<React.SetStateAction<number>>;
    pointsData: any[];
    selectedId: string | number;
}

export default function UnitPlanContentPage({
    setSelectedId,
    pointsData,
    selectedId,
}: UnitPlanContentPageProps) {
    return (<>
        {/* Layer 2: Connecting Lines & Target Markers */}
        <g className="pointer-events-none">
            {pointsData.map((point) => {
                const isActive = point.id === selectedId;
                const startCoords = point.points[0];

                return (
                    <g key={`marker-${point.id}`}>
                        {/* Elbow Line */}
                        <polyline
                            points={point.points.map((p: any) => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke={isActive ? '#ffffff' : 'rgba(255,255,255,0.4)'}
                            strokeWidth={isActive ? '3' : '1.5'}
                            strokeDasharray={isActive ? 'none' : '6 6'}
                            vectorEffect="non-scaling-stroke"
                            className="transition-all duration-500 ease-out"
                        />

                        {/* Target Circle on Floor Plan */}
                        <circle
                            cx={startCoords.x}
                            cy={startCoords.y}
                            r={isActive ? '10' : '8'}
                            fill={isActive ? 'rgba(255, 255, 255, 0.95)' : '#06364a'}
                            stroke={isActive ? '#ffffff' : '#dfeff6'}
                            strokeWidth={isActive ? '3' : '2'}
                            vectorEffect="non-scaling-stroke"
                            className="transition-all duration-500 ease-out"
                        />

                        {/* Pulsing Target Ring */}
                        {isActive && (
                            <circle
                                cx={startCoords.x}
                                cy={startCoords.y}
                                r="22"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                                className="animate-ping opacity-75"
                            />
                        )}
                    </g>
                );
            })}
        </g>

        {/* Layer 3: Hotspot Cards (Render Unselected First, Active Last) */}
        <g className="pointer-events-auto">
            {[...pointsData]
                .sort((a, b) => (a.id === selectedId ? 1 : b.id === selectedId ? -1 : 0))
                .map((point) => {
                    const isActive = point.id === selectedId;

                    return (

                        <foreignObject
                            x={point.labelX - 120}
                            y={point.labelY - 50}
                            width="250"
                            height="190"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(point.id);
                            }}
                            className="overflow-visible pointer-events-auto"
                        >
                            <div
                                className={`w-full py-5 px-4 rounded-xl border 
                                                            transition-all duration-500 
                                                            ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                                                            transform-gpu cursor-pointer
                                                             shadow-2xl ${isActive
                                        ? 'bg-[#082842] border-cyan-400 shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105 opacity-100 z-50'
                                        : 'bg-[#051a2d] border-white/40 hover:border-cyan-400/80 opacity-90 hover:opacity-100 hover:scale-[1.02]'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full border border-white/60 text-[15px] text-white/90 font-mono font-bold">
                                        {point.id}
                                    </span>
                                    <h3 className="text-[17px] font-semibold text-white tracking-wide truncate">
                                        {point.name}
                                    </h3>
                                </div>
                                <div className="flex items-start gap-2">
                                    <img src={point.icon} className="w-6 h-6 shrink-0" alt="" />
                                    <p className="text-[16px] text-slate-300 mt-1 leading-tight line-clamp-2">
                                        {point.subtitle}
                                    </p>
                                </div>
                            </div>
                        </foreignObject>


                    );
                })}
        </g>
    </>)
}