import { useState } from "react";
import { motion } from "framer-motion";
import MasterplanGround from "../assets/floorplan/masterplan-ground.png";
import MasterplanTerrace from "../assets/floorplan/masterplan-terrace.png";
import Sidebar from "../Components/Navbar/Sidebar";
import sitePlanLocal from "../Data/sitePlanConfig.json";
import terracePlanLocal from "../Data/terracePlanConfig.json";
import HotspotMarker from "../Components/SitePlan/HotspotMarker";

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

  const handleLayoutSelect = (layout: string) => {
    setIsTerrace(layout === "Terrace layout");
  };

  const currentLevel = isTerrace ? "terrace" : "ground";
  const activeData: MasterPlanItem[] = isTerrace ? terracePlanLocal : sitePlanLocal;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Sidebar 
        onLayoutSelect={handleLayoutSelect} 
        onLabelsToggle={(show) => setIsLabelsVisible(show)}
      />

      <div className="flex h-full w-full items-center justify-center p-4 pl-24 sm:pl-[17rem]">
        <div className="relative max-h-full max-w-full">
          {/* Soft brand-red glow behind the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] bg-[#e8321c]/40 blur-3xl sm:-inset-10"
          />
          <div className="max-h-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-2 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-3">
            <div className="relative max-h-[88vh] max-w-full overflow-hidden rounded-lg border border-white/20">
              {/* invisible sizer - gives the box real dimensions since the
                  cross-fading images below are all position:absolute and
                  wouldn't otherwise contribute any size */}
              <img
                src={MasterplanGround}
                alt=""
                aria-hidden
                className="invisible max-h-[88vh] max-w-full object-contain"
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
                    "absolute inset-0 size-full object-contain transition-opacity duration-[900ms] ease-in-out",
                    active ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              ))}

              {/* Overlay SVG Markings Layer */}
              <svg
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                viewBox={currentLevel === "ground" ? "0 0 5121 2382" : "0 0 5325 2638"}
                preserveAspectRatio="xMidYMid meet"
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
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}