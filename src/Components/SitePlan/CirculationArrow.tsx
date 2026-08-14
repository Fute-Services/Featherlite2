import { motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";
type Tone = "entry" | "exit";

interface CirculationArrowProps {
    id: string;
    x: number;
    y: number;
    direction: Direction;
    /** entry = lime (pointing into the building), exit = red (pointing away) */
    tone?: Tone;
    /** perpendicular offset so paired entry/exit arrows sit side by side */
    offset?: number;
    scale?: number;
}

// local arrow points "down" (toward the anchor point) at rotation 0
const ROTATION: Record<Direction, number> = {
    down: 0,
    up: 180,
    right: -90,
    left: 90,
};

const TONE_COLORS: Record<Tone, string> = {
    entry: "#a3e635",
    exit: "#ef4444",
};

/**
 * A solid-color arrow (lime for entry, red for exit) that bounces toward
 * its anchor point, marking a circulation door on the site plan overlay.
 *
 * The positioning transform is on a plain SVG <g>, not a motion.g - framer
 * motion manages its own `transform` on motion elements internally, and a
 * manually-set `transform` attribute on a motion component gets clobbered
 * by that (every instance collapsed to the same spot). The inner motion.g
 * elements only animate opacity/y, so they don't fight over `transform`.
 */
const CirculationArrow = ({ id, x, y, direction, tone = "exit", offset = 0, scale = 1 }: CirculationArrowProps) => {
    const length = 85 * scale;
    const headLength = 28 * scale;
    const headWidth = 30 * scale;
    const strokeWidth = 10 * scale;
    const color = TONE_COLORS[tone];

    return (
        <g transform={`translate(${x}, ${y}) rotate(${ROTATION[direction]})`}>
            {/* offset is a plain <g> for the same reason as the outer positioning -
                a motion component would clobber a manually-set transform attribute */}
            <g transform={`translate(${offset}, 0)`}>
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <motion.g
                        animate={{ y: [0, headLength * 0.6, 0] }}
                        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <line
                            x1={0}
                            y1={-length}
                            x2={0}
                            y2={-headLength}
                            stroke={color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            id={`circulation-arrow-${id}`}
                        />
                        <polygon
                            points={`0,0 ${-headWidth / 2},${-headLength} ${headWidth / 2},${-headLength}`}
                            fill={color}
                        />
                    </motion.g>
                </motion.g>
            </g>
        </g>
    );
};

export default CirculationArrow;
