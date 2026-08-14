import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MasterplanGround from "../assets/floorplan/masterplan-ground.png";
import MasterplanTerrace from "../assets/floorplan/masterplan-terrace.png";
import Sidebar from "../Components/Navbar/Sidebar";
import sitePlanLocal from "../Data/sitePlanConfig.json";
import terracePlanLocal from "../Data/terracePlanConfig.json";
import circulationConfig from "../Data/circulationConfig.json";
import HotspotMarker from "../Components/SitePlan/HotspotMarker";
import CirculationArrow from "../Components/SitePlan/CirculationArrow";

type CirculationDirection = "up" | "down" | "left" | "right";
const CIRCULATION_POINTS = circulationConfig as Record<
  string,
  { x: number; y: number; direction: CirculationDirection }[]
>;
const OPPOSITE_DIRECTION: Record<CirculationDirection, CirculationDirection> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

interface MasterPlanItem {
  id: string;
  title: string;
  description: string;
  polygon?: string;
  x: number;
  y: number;
  _id?: string;
}

const parsePoints = (pointsStr?: string) => {
  if (!pointsStr) return null;
  const numbers = pointsStr.match(/-?\d+(\.\d+)?/g);
  if (!numbers || numbers.length < 2) return null;

  const parsed = [];
  for (let i = 0; i < numbers.length; i += 2) {
    if (i + 1 < numbers.length) {
      parsed.push({
        x: parseFloat(numbers[i]),
        y: parseFloat(numbers[i + 1]),
      });
    }
  }
  return parsed.length > 0 ? parsed : null;
};

const ensureHighResCoordinate = (val: number, type: "x" | "y", currentLevel: "ground" | "terrace") => {
  const isLowRes = type === "x" ? val <= 1200 : val <= 629;
  if (!isLowRes) return val;

  const imgSize = currentLevel === "ground"
    ? (type === "x" ? 5121 : 2382)
    : (type === "x" ? 5325 : 2638);
  const targetSize = type === "x" ? 1200 : 629;

  return val * (imgSize / targetSize);
};

const ensureHighResPoints = (polygonStr?: string, currentLevel: "ground" | "terrace" = "ground") => {
  const points = parsePoints(polygonStr);
  if (!points) return null;

  const isHighRes = points.some(pt => pt.x > 1200 || pt.y > 629);

  if (!isHighRes) {
    const imgW = currentLevel === "ground" ? 5121 : 5325;
    const imgH = currentLevel === "ground" ? 2382 : 2638;
    return points.map(pt => ({
      x: pt.x * (imgW / 1200),
      y: pt.y * (imgH / 629)
    }));
  }

  return points;
};

const ensureHighResMultipleLines = (polygonStr?: string, currentLevel: "ground" | "terrace" = "ground") => {
  if (!polygonStr) return [];
  const lineStrings = polygonStr.split(";");
  return lineStrings
    .map(lineStr => ensureHighResPoints(lineStr, currentLevel))
    .filter((line): line is { x: number; y: number }[] => line !== null);
};

export default function MasterplanPage() {
  const [isTerrace, setIsTerrace] = useState<boolean>(false);
  const [isLabelsVisible, setIsLabelsVisible] = useState<boolean>(false);
  const [selectedCirculation, setSelectedCirculation] = useState<string | null>(null);

  const handleLayoutSelect = (layout: string) => {
    setIsTerrace(layout === "Terrace layout");
  };

  const currentLevel = isTerrace ? "terrace" : "ground";
  const activeData: MasterPlanItem[] = isTerrace ? terracePlanLocal : sitePlanLocal;
  // circulation markings are only defined for the ground layout
  const circulationArrows = !isTerrace && selectedCirculation ? CIRCULATION_POINTS[selectedCirculation] ?? [] : [];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Sidebar
        onLayoutSelect={handleLayoutSelect}
        onLabelsToggle={(show) => setIsLabelsVisible(show)}
        onCirculationSelect={setSelectedCirculation}
      />

      {/* both stay mounted so the layout switch cross-fades instead of flashing */}
      {[
        { src: MasterplanGround, active: !isTerrace },
        { src: MasterplanTerrace, active: isTerrace },
      ].map(({ src, active }) => (
        <img
          key={src}
          src={src}
          alt="Project Masterplan"
          className={[
            "absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-in-out",
            active ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      ))}

      {/* Overlay SVG Markings Layer - slice matches the image's object-cover crop */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox={currentLevel === "ground" ? "0 0 5121 2382" : "0 0 5325 2638"}
        preserveAspectRatio="xMidYMid slice"
      >
                <defs>
                  <radialGradient
                    id="circle-gradient"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="#FF0000" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Circles, Lines, and Labels */}
                {activeData.map((marker, index) => {
                  const scale = currentLevel === "ground" ? 5121 / 1200 : 5325 / 1200;
                  const lines = ensureHighResMultipleLines(marker.polygon, currentLevel);
                  const hasLines = lines.length > 0;

                  const boxDotX = ensureHighResCoordinate(marker.x, "x", currentLevel);
                  const boxDotY = ensureHighResCoordinate(marker.y, "y", currentLevel);

                  return (
                    <g key={`group-${marker.id || index}-${index}`}>
                      {isLabelsVisible && (
                        <>
                          {/* Render each connecting line if polygon exists */}
                          {hasLines && lines.map((linePoints, lIndex) => {
                            const pointsStr = linePoints.map((p) => `${p.x},${p.y}`).join(" ");
                            const lineDotX = linePoints[0].x;
                            const lineDotY = linePoints[0].y;

                            return (
                              <g key={`line-${lIndex}`}>
                                <motion.polyline
                                  points={pointsStr}
                                  fill="none"
                                  stroke="#EF4444"
                                  strokeWidth={1.2 * scale}
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                                <circle
                                  cx={lineDotX}
                                  cy={lineDotY}
                                  r={3.5 * scale}
                                  fill="#EF4444"
                                  className="pointer-events-none"
                                />
                              </g>
                            );
                          })}

                          {/* Glowing background circle */}
                          <circle
                            cx={boxDotX}
                            cy={boxDotY}
                            r={15 * scale}
                            fill="url(#circle-gradient)"
                            stroke="transparent"
                            strokeWidth="0"
                            className="transition-all duration-300 pointer-events-auto cursor-pointer hover:opacity-80"
                          />
                        </>
                      )}
                      <HotspotMarker
                        key={`${marker.id || index}-${index}`}
                        {...marker}
                        x={boxDotX}
                        y={boxDotY}
                        scale={scale}
                        isVisible={isLabelsVisible}
                      />
                    </g>
                  );
                })}

                {/* Circulation entry (lime) / exit (red) arrow pairs for the selected type */}
                <AnimatePresence>
                  {circulationArrows.map((point, index) => {
                    const arrowScale = currentLevel === "ground" ? 5121 / 1200 : 5325 / 1200;
                    const arrowX = ensureHighResCoordinate(point.x, "x", currentLevel);
                    const arrowY = ensureHighResCoordinate(point.y, "y", currentLevel);
                    // same local offset for both - since their rotations differ by
                    // 180 degrees, it naturally places them on opposite world sides
                    const pairOffset = -18 * arrowScale;

                    return (
                      <g key={`${selectedCirculation}-${index}`}>
                        <CirculationArrow
                          id={`${selectedCirculation}-${index}-entry`}
                          x={arrowX}
                          y={arrowY}
                          direction={point.direction}
                          tone="entry"
                          offset={pairOffset}
                          scale={arrowScale}
                        />
                        <CirculationArrow
                          id={`${selectedCirculation}-${index}-exit`}
                          x={arrowX}
                          y={arrowY}
                          direction={OPPOSITE_DIRECTION[point.direction]}
                          tone="exit"
                          offset={pairOffset}
                          scale={arrowScale}
                        />
                      </g>
                    );
                  })}
                </AnimatePresence>
              </svg>
    </div>
  );
}