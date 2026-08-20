import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MasterplanGround from "../assets/floorplan/MasterPlan (2).jpg.jpeg";
import MasterplanTerrace from "../assets/floorplan/Terrace Plan (2).jpg.jpeg";
import Sidebar from "../Components/Navbar/Sidebar";
import sitePlanLocal from "../Data/sitePlanConfig.json";
import terracePlanLocal from "../Data/terracePlanConfig.json";
import interactiveRegionsConfig from "../Data/interactiveRegionsConfig.json";
import terraceInteractiveRegionsConfig from "../Data/terraceInteractiveRegionsConfig.json";
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
  polygon?: string | string[];
  hoverPolygon?: string;
  image?: string;
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

const ensureHighResCoordinate = (val: number, type: "x" | "y") => {
  const isLowRes = type === "x" ? val <= 1200 : val <= 629;
  if (!isLowRes) return val;

  const targetSize = type === "x" ? 1200 : 629;
  const imgSize = type === "x" ? 2593 : 1589;

  return val * (imgSize / targetSize);
};

const ensureHighResPoints = (polygonStr?: string) => {
  const points = parsePoints(polygonStr);
  if (!points) return null;
  return points;
};

const ensureHighResMultipleLines = (polygonVal?: string | string[]) => {
  if (!polygonVal) return [];
  let lineStrings: string[] = [];
  if (Array.isArray(polygonVal)) {
    lineStrings = polygonVal;
  } else if (typeof polygonVal === "string") {
    lineStrings = polygonVal.split(";");
  } else {
    return [];
  }
  return lineStrings
    .map(lineStr => ensureHighResPoints(lineStr))
    .filter((line): line is { x: number; y: number }[] => line !== null);
};

export default function MasterplanPage() {
  const [isTerrace, setIsTerrace] = useState<boolean>(false);
  const [isLabelsVisible, setIsLabelsVisible] = useState<boolean>(false);
  const [selectedCirculation, setSelectedCirculation] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const circulationVideoRef = useRef<HTMLVideoElement>(null);

  const handleLayoutSelect = (layout: string) => {
    setIsTerrace(layout === "Terrace layout");
    setIsLabelsVisible(layout === "Ground layout" || layout === "Terrace layout");
    setSelectedCirculation(null);
  };

  const activeData: MasterPlanItem[] = isTerrace ? terracePlanLocal : sitePlanLocal;
  const activeInteractiveRegions = isTerrace ? terraceInteractiveRegionsConfig : interactiveRegionsConfig;
  // circulation videos are only defined for the ground layout
  const circulationVideo = !isTerrace && selectedCirculation ? CIRCULATION_VIDEOS[selectedCirculation] : undefined;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Sidebar
        onLayoutSelect={handleLayoutSelect}
        onCirculationSelect={setSelectedCirculation}
      />

      <div className="relative h-full w-full">
        {/* both stay mounted so the layout switch cross-fades instead of flashing */}
        {[
          { src: MasterplanGround, active: !isTerrace },
          { src: MasterplanTerrace, active: isTerrace },
        ].map(({ src, active }) => (
          <img
            key={src}
            src={src}
            alt="Project Masterplan"
            loading={active ? "eager" : "lazy"}
            decoding="async"
            className={[
              "absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-in-out",
              active ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        ))}

        {/* Overlay SVG Markings Layer */}
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox="0 0 2593 1589"
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

          {/* 1. Existing Markings (Fully Untouched) */}
          {activeData.map((marker, index) => {
            const scale = 2593 / 1200;
            const lines = ensureHighResMultipleLines(marker.polygon);
            const hasLines = lines.length > 0;

            const boxDotX = ensureHighResCoordinate(marker.x, "x");
            const boxDotY = ensureHighResCoordinate(marker.y, "y");

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
                          <polyline
                            points={pointsStr}
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth={3}
                            strokeDasharray="8,8"
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

          {/* 2. New Separate Feature: Interactive Map Regions */}
          {activeInteractiveRegions.map((region) => {
              const points = parsePoints(region.polygon);
              if (!points) return null;
              const isHovered = hoveredRegionId === region.id;

              return (
                <polygon
                  key={region.id}
                  points={points.map(p => `${p.x},${p.y}`).join(" ")}
                  fill={isHovered ? "rgba(239, 68, 68, 0.25)" : "rgba(255, 255, 255, 0.01)"}
                  stroke={isHovered ? "#EF4444" : "transparent"}
                  strokeWidth={isHovered ? 2 : 0}
                  className="cursor-pointer transition-all duration-200 pointer-events-auto"
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                  onClick={() => setModalImage(region.image)}
                />
              );
            })}
        </svg>

        {/* Circulation video overlay */}
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
              className="absolute inset-0 z-40 size-full object-cover [filter:brightness(1.15)_contrast(1.08)_saturate(1.15)] pointer-events-auto"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </AnimatePresence>

        {/* Lightbox / Modal for Image Preview */}
        {modalImage && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-40 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/60 p-1 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Location Preview"
                decoding="async"
                className="max-h-[75vh] w-auto object-fit rounded-2xl shadow-2xl"
                onError={(e) => {
                  // Fallback restaurant interior if the image doesn't exist
                  e.currentTarget.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000";
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}