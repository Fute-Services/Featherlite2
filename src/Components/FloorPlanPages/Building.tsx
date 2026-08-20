import { useRef, useState } from 'react'
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
    selectedFloorId,
    handleOpenUnitPlan,
    TOWER_X_RIGHT,
    FLOORS,
    handleFloorSelect,
    aspectRatio,
    building,
}: BuildingProps) {
    const [isImageHovered, setIsImageHovered] = useState(false)
    const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleImageMouseEnter = () => {
        if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current)
        setIsImageHovered(true)
    }
    const handleImageMouseLeave = () => {
        hoverLeaveTimer.current = setTimeout(() => setIsImageHovered(false), 150)
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full animate-blueprint-unfold max-w-[3964px] max-h-[2048px]">
                <svg
                    viewBox="0 0 3964 2048"
                    className="w-full h-full touch-none select-none"
                    preserveAspectRatio={aspectRatio}
                >
                    <defs>
                        {/* Fill Gradient */}
                        <linearGradient id="activeFloorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#DBDEDF" stopOpacity="0.75" />
                            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.40" />
                            <stop offset="100%" stopColor="#DBDEDF" stopOpacity="0.75" />
                        </linearGradient>

                        {/* Subtle Outline Glow for Active Polygon */}
                        <linearGradient id="activeStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#F87171" stopOpacity="0.4" />
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
                        className="cursor-pointer"
                        onMouseEnter={handleImageMouseEnter}
                        onMouseLeave={handleImageMouseLeave}
                    />

                    {/* Interactive Floor Polygon Overlays */}
                    {FLOORS?.map((floor) => {
                        const isActive = floor.id === selectedFloorId

                        return (
                            <motion.polygon
                                key={floor.id}
                                points={floor.polygon}
                                onDoubleClick={() => handleOpenUnitPlan(`${floor.idnew}`)}
                                onMouseEnter={() => handleFloorSelect(floor.id)}
                                onTouchStart={() => handleFloorSelect(floor.id)}
                                fill="url(#activeFloorGradient)"
                                // stroke="url(#activeStrokeGradient)"
                                initial={false}
                                animate={{
                                    opacity: isActive ? 1 : 0,
                                    strokeWidth: isActive ? 4 : 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                    ease: [0.25, 1, 0.5, 1], // Fluid cubic-bezier for rapid hovering
                                }}
                                style={{ pointerEvents: 'fill' }}
                                className="cursor-pointer transition-colors duration-200"
                            />
                        )
                    })}

                    {/* Red Indicator Line & Dot (Smooth Sliding Motion) */}
                    {activeFloor && (
                        <g>
                            {/* Red Dot on Right Edge */}
                            <motion.circle
                                cx={TOWER_X_RIGHT}
                                fill="#EF4444"
                                initial={{ opacity: 0, r: 0 }}
                                animate={{
                                    opacity: 1,
                                    r: 9,
                                    cy: activeFloor.centerY
                                }}
                                transition={{
                                    cy: { type: 'spring', damping: 30, stiffness: 350 },
                                    opacity: { duration: 0.2 },
                                    r: { duration: 0.2 }
                                }}
                            />

                            {/* Dashed Red Connecting Line */}
                            <motion.line
                                x1={TOWER_X_RIGHT}
                                stroke="#EF4444"
                                strokeWidth="4"
                                strokeDasharray="8 8"
                                initial={{ opacity: 0, x2: TOWER_X_RIGHT }}
                                animate={{
                                    opacity: 1,
                                    x2: TOWER_X_RIGHT + 120,
                                    y1: activeFloor.centerY,
                                    y2: activeFloor.centerY
                                }}
                                transition={{
                                    y1: { type: 'spring', damping: 30, stiffness: 350 },
                                    y2: { type: 'spring', damping: 30, stiffness: 350 },
                                    x2: { duration: 0.3, ease: 'easeOut' },
                                    opacity: { duration: 0.2 }
                                }}
                            />
                        </g>
                    )}

                    {activeFloor && (
                        <foreignObject
                            x={TOWER_X_RIGHT + 140}
                            y={activeFloor.yaxis ?? 100}
                            width="350"
                            height="75"
                            className="pointer-events-none overflow-visible"
                        >
                            <div className="w-full h-full flex items-center justify-start">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFloor.id}
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="inline-flex items-center"
                                    >
                                        {/* ✨ Glassmorphism Card ✨ */}
                                        <div className="
            bg-white/10 
            bg-gradient-to-br from-black/20 via-black/10 to-transparent 
            backdrop-blur-xl 
            backdrop-saturate-150 
            border border-white/30 
            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] 
            px-6 py-3 
            rounded-full 
            flex items-center gap-3 
            text-white
          ">
                                            <span className="text-[30px] font-medium tracking-wide drop-shadow-sm">
                                                {activeFloor.name}
                                            </span>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </foreignObject>
                    )}
                </svg>
            </div>

            {/* Hover Preview: enlarged building render */}
            <AnimatePresence>
                {isImageHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-40 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 12 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/60 p-1 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)]"
                        >
                            <img
                                src={building}
                                alt="Building Preview"
                                decoding="async"
                                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}