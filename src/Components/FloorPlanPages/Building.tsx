import { motion, AnimatePresence } from 'framer-motion'

import { type FloorData } from '../../types/Floorplan'

interface BuildingProps {
    activeFloor: FloorData | undefined
    selectedFloorId: string
    handleOpenUnitPlan: (id: string) => void;
    TOWER_X_RIGHT: number
    FLOORS: FloorData[]
    handleFloorSelect: (id: string) => void
    aspectRatio: string
    building: string
}

export default function Building({
    activeFloor,
    selectedFloorId, handleOpenUnitPlan,
    TOWER_X_RIGHT,
    FLOORS,
    handleFloorSelect,
    aspectRatio,
    building,
}: BuildingProps) {
    return (
        <div className="relative w-full h-full  flex items-center justify-center">
            <div className="relative w-full h-full max-w-[3964px] max-h-[2048px]">
                <svg
                    viewBox="0 0 3964 2048"
                    className="w-full h-full touch-none"
                    preserveAspectRatio={aspectRatio}
                >
                    <defs>
                        <linearGradient id="activeFloorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DBDEDF" stopOpacity="0.80" />
                            <stop offset="50%" stopColor="#DBDEDF" stopOpacity="0.30" />
                            <stop offset="100%" stopColor="#DBDEDF" stopOpacity="0.80" />
                        </linearGradient>
                    </defs>

                    {/* Building Render Image */}
                    <image
                        href={building}
                        x="0"
                        y="0"
                        width="3964"
                        height="2048"
                        preserveAspectRatio={aspectRatio}
                    />

                    {/* Interactive Floor Polygon Overlays */}
                    {FLOORS?.map((floor) => {
                        const isActive = floor.id === selectedFloorId
                        return (
                            <motion.polygon
                                key={floor.id}
                                points={floor.polygon}
                                onDoubleClick={() => handleOpenUnitPlan(`${floor.id}`)}
                                onMouseEnter={() => handleFloorSelect(floor.id)}
                                onTouchStart={() => handleFloorSelect(floor.id)}
                                fill="url(#activeFloorGradient)"
                                initial={false}
                                animate={{
                                    opacity: isActive ? 1 : 0,
                                }}
                                whileHover={{
                                    opacity: isActive ? 1 : 0.25,
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.52, 1, 0.36, 1],
                                }}
                                className="cursor-pointer"
                            />
                        )
                    })}

                    {/* Red Indicator Line & Dot */}
                    <AnimatePresence mode="wait">
                        {activeFloor && (
                            <g key={`indicator-${activeFloor.id}`}>
                                {/* Red Dot on Right Edge of Tower */}
                                <motion.circle
                                    initial={{ opacity: 0, r: 0 }}
                                    animate={{ opacity: 1, r: 9 }}
                                    exit={{ opacity: 0, r: 0 }}
                                    cx={TOWER_X_RIGHT}
                                    cy={activeFloor.centerY}
                                    fill="#EF4444"
                                />

                                {/* Dashed Red Connecting Line */}
                                <motion.line
                                    initial={{ opacity: 0, x2: TOWER_X_RIGHT }}
                                    animate={{ opacity: 1, x2: TOWER_X_RIGHT + 120 }}
                                    exit={{ opacity: 0 }}
                                    x1={TOWER_X_RIGHT}
                                    y1={activeFloor.centerY}
                                    y2={activeFloor.centerY}
                                    stroke="#EF4444"
                                    strokeWidth="4"
                                    strokeDasharray="8 8"
                                />
                            </g>
                        )}
                    </AnimatePresence>

                    {/* Floating Floor Pill Badge */}
                    {activeFloor && (
                        <foreignObject
                            x={TOWER_X_RIGHT + 140}
                            y={activeFloor.centerY - 35}
                            width="350"
                            height="75"
                            className="overflow-visible pointer-events-none block"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFloor.id}
                                    initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                    transition={{ type: 'spring', damping: 27, stiffness: 300 }}
                                    className="inline-flex items-center"
                                >
                                    <div className="bg-black/30 backdrop-blur-md px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 text-white">
                                        <span className="text-xl font-medium tracking-wide">
                                            {activeFloor.name}
                                        </span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </foreignObject>
                    )}
                </svg>
            </div>
        </div>
    )
}