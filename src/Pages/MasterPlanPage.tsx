import { useState } from "react";
import MasterplanGround from "../assets/floorplan/MasterPlan (2).jpg.jpeg";
import MasterplanTerrace from "../assets/floorplan/Terrace Plan (2).jpg.jpeg";
import Sidebar from "../Components/Navbar/Sidebar";
import sitePlanLocal from "../Data/sitePlanConfig.json";
import terracePlanLocal from "../Data/terracePlanConfig.json";
import interactiveRegionsConfig from "../Data/interactiveRegionsConfig.json";
import HotspotMarker from "../Components/SitePlan/HotspotMarker";

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
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

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
          {/* 1. Existing Markings (Fully Untouched) */}
          {activeData.map((marker, index) => {
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
                            r={6}
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
                  isVisible={isLabelsVisible}
                />
              </g>
            );
          })}

          {/* 2. New Separate Feature: Interactive Map Regions */}
          {interactiveRegionsConfig
            .filter((region) => region.level === currentLevel)
            .map((region) => {
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

        {/* Lightbox / Modal for Image Preview */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[3px] z-[2000] flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/60 p-1 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Location Preview"
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