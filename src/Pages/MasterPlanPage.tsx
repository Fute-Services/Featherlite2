import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MasterplanGround from "../assets/floorplan/masterplan-ground.jpg";
import MasterplanTerrace from "../assets/floorplan/masterplan-terrace.jpg";
import Sidebar from "../Components/Navbar/Sidebar";
import sitePlanLocal from "../Data/sitePlanConfig.json";
import terracePlanLocal from "../Data/terracePlanConfig.json";
import HotspotMarker from "../Components/SitePlan/HotspotMarker";

const CIRCULATION_VIDEOS: Record<string, string> = {
  "Main Entry/Exit": "/circulation-videos/main-entry-exit.mp4",
  "Entry/Exit To Building": "/circulation-videos/entry-exit-to-building.mp4",
  "Ramp Access": "/circulation-videos/ramp-access.mp4",
  "Visitors Parking": "/circulation-videos/visitors-parking.mp4",
  "Two wheeler Parking": "/circulation-videos/two-wheeler-parking.mp4",
  "Driveway to Drop off": "/circulation-videos/driveway-to-dropoff.mp4",
  "Driveway to Basement": "/circulation-videos/driveway-to-basement.mp4",
  "Pedestrian Entry": "/circulation-videos/pedestrian-entry.mp4",
  "Fire Exit": "/circulation-videos/fire-exit.mp4",
  "Walking Lane & Cycling Lane": "/circulation-videos/walking-cycling-lane.mp4",
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
  const circulationVideoRef = useRef<HTMLVideoElement>(null);

  const handleLayoutSelect = (layout: string) => {
    setIsTerrace(layout === "Terrace layout");
  };

  const currentLevel = isTerrace ? "terrace" : "ground";
  const activeData: MasterPlanItem[] = isTerrace ? terracePlanLocal : sitePlanLocal;
  // circulation videos are only defined for the ground layout
  const circulationVideo = !isTerrace && selectedCirculation ? CIRCULATION_VIDEOS[selectedCirculation] : undefined;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
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
              </svg>

      {/* Circulation video overlay - occupies the exact same box as the masterplan image.
          mode="wait" so only one clip's motion is ever on screen - overlapping two
          different clips' camera motion during a crossfade read as the frame jumping. */}
      <AnimatePresence mode="wait">
        {circulationVideo && (
          <motion.video
            ref={circulationVideoRef}
            key={circulationVideo}
            src={circulationVideo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-40 size-full object-cover [filter:brightness(1.15)_contrast(1.08)_saturate(1.15)]"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </AnimatePresence>
    </div>
  );
}