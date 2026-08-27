import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HotspotMarkerProps {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  scale?: number;
  isVisible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  title,
  x,
  y,
  isVisible,
  onMouseEnter,
  onMouseLeave,
}) => {
  // SVG coordinates: x and y are the exact pixel centers.
  // Set a large bounding box to prevent browser clipping, centering the content inside it.
  const width = 600;
  const height = 200;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.foreignObject
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          x={x - width / 2}
          y={y - height / 2}
          width={width}
          height={height}
          className="pointer-events-none overflow-visible"
        >
          <div className="w-full h-full flex flex-col items-center justify-center relative pointer-events-none">
            <div
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className="relative bg-black/60 border border-white/20 backdrop-blur-md text-white px-5 py-2.5 text-[15px] font-medium tracking-wide whitespace-nowrap cursor-pointer hover:bg-black/80 transition-colors shadow-2xl rounded-full pointer-events-auto"
            >
              {title}
            </div>
          </div>
        </motion.foreignObject>
      )}
    </AnimatePresence>
  );
};

export default HotspotMarker;
