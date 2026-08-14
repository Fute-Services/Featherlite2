import React from 'react';

interface UnitPlanContentPageProps {
    setSelectedId: React.Dispatch<React.SetStateAction<number>>;
    pointsData: any[];
    selectedId: string | number;
}

export default function UnitPlanContentPage({
    setSelectedId,
    pointsData = [],
    selectedId,
}: UnitPlanContentPageProps) {
    if (!pointsData || pointsData.length === 0) return null;

    return (
        <>
            {/* Layer 2: Connecting Lines & Target Markers */}
            <g className="pointer-events-none bg-transparent">
                {pointsData.map((point) => {
                    const isActive = point.id === selectedId;

                    // 1. Guard against undefined or empty points array
                    const pointsList = point.points || [];
                    const startCoords = pointsList[0];

                    // If there are no points defined for this item, skip rendering marker
                    if (!startCoords) return null;

                    return (
                        <g key={`marker-${point.id}`}>
                            {/* SVG Radial Glow Filter (Add inside <defs> or render inline) */}
                            <defs>
                                <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#ffea9f" stopOpacity="1" />
                                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            {/* 1. Elbow Line */}
                            <polyline
                                points={pointsList.map((p: any) => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke={isActive ? '#c89d52' : 'rgba(200, 157, 82, 0.45)'}
                                strokeWidth={isActive ? '2' : '1.2'}
                                strokeDasharray="none"
                                vectorEffect="non-scaling-stroke"
                                className="transition-all duration-300 ease-out"
                            />

                            {/* 2. Outer Glowing Halo Ring (Active State) */}
                            {isActive && (
                                <>
                                    {/* Translucent Gold Blur Halo */}
                                    <circle
                                        cx={startCoords.x}
                                        cy={startCoords.y}
                                        r="24"
                                        fill="rgba(245, 158, 11, 0.15)"
                                        stroke="#c89d52"
                                        strokeWidth="1"
                                        strokeOpacity="0.6"
                                        vectorEffect="non-scaling-stroke"
                                        className="transition-all duration-500 ease-out"
                                    />

                                    {/* Subtle Outer Pulsing Wave */}
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

                            {/* 3. Outer Border Ring for Inactive State */}
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

                            {/* 4. Glowing Center Gold Dot */}
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
                {[...pointsData]
                    // 1. Filter out duplicates (keeps the first occurrence of each ID)
                    .filter((point, index, self) => index === self.findIndex((p) => p.id === point.id))
                    // 2. Sort so selected card renders on top
                    .sort((a, b) => (a.id === selectedId ? 1 : b.id === selectedId ? -1 : 0))
                    .map((point) => {
                        const isActive = point.id === selectedId;

                        return (
                            <foreignObject
                                key={`card-${point.id}`}
                                x={(point.labelX ?? 0) - 120}
                                y={(point.labelY ?? 0) - 50}
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
                        transition-all duration-700 
                        ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                        transform-gpu cursor-pointer
                        shadow-2xl ${isActive
                                            ? 'bg-[#082842] border-white/60 shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105 opacity-100 z-50'
                                            : 'bg-[#051a2d] border-white/40 hover:border-[#a17834] opacity-90 hover:opacity-100 hover:scale-[1.02] ease-in-out transition-all duration-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#a17834] text-[16px] text-white/90 font-mono font-bold">
                                            {point.id}
                                        </span>
                                        <h3 className="text-[17px] font-semibold text-white
                                         tracking-wide truncate">
                                            {point.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        {point.icon && (
                                            <img src={point.icon} className="w-6 h-6 shrink-0" alt="" />
                                        )}
                                        <p className="text-[16px] text-slate-300 mt-1 leading-tight line-clamp-2">
                                            {point.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </foreignObject>
                        );
                    })}
            </g>
        </>
    );
}