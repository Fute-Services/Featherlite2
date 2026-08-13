import { motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

interface CirculationArrowProps {
    id: string;
    x: number;
    y: number;
    direction: Direction;
    scale?: number;
}

// local arrow points "down" (toward the anchor point) at rotation 0
const ROTATION: Record<Direction, number> = {
    down: 0,
    up: 180,
    right: -90,
    left: 90,
};

/**
 * A gradient (lime -> red) arrow that bounces toward its anchor point,
 * marking a circulation entry/exit on the site plan overlay.
 */
const CirculationArrow = ({ id, x, y, direction, scale = 1 }: CirculationArrowProps) => {
    const length = 95 * scale;
    const headLength = 30 * scale;
    const headWidth = 34 * scale;
    const strokeWidth = 11 * scale;
    const gradientId = `circulation-arrow-gradient-${id}`;

    return (
        <motion.g
            transform={`translate(${x}, ${y}) rotate(${ROTATION[direction]})`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a3e635" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
            </defs>
            <motion.g
                animate={{ y: [0, headLength * 0.6, 0] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            >
                <line
                    x1={0}
                    y1={-length}
                    x2={0}
                    y2={-headLength}
                    stroke={`url(#${gradientId})`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                <polygon
                    points={`0,0 ${-headWidth / 2},${-headLength} ${headWidth / 2},${-headLength}`}
                    fill="#ef4444"
                />
            </motion.g>
        </motion.g>
    );
};

export default CirculationArrow;
