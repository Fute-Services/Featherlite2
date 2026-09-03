import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AutoVideo, { prefetchVideo } from "../Components/Media/AutoVideo";
const MasterplanGround = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/masterplan-2-jpg/web2560";
const MasterplanTerrace = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/terrace-plan-2-jpg/web2560";
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

/**
 * Preview photo sizing, shared by the hover preview and the lightbox.
 *
 * Capping the height alone made the wide shots (maingate and the foyers are
 * 2.35:1) render far wider than the 1.9:1 ones like the restaurant, so they
 * read as oversized next to it. The width cap is what evens them out - and on a
 * tablet it is the cap that binds, so it is set to just about all the room left
 * beside the open sidebar (66vw against ~68-77vw of free width, the couple of
 * points of slack being the frame border) rather than anything smaller.
 *
 * Both are *max* constraints, so a photo is only ever scaled down - none of
 * these is upscaled past its natural size, which is what would make it look
 * soft.
 */
const PREVIEW_IMAGE_CLASS =
  "max-h-[80vh] w-auto max-w-[min(66vw,1250px)] object-contain rounded-2xl shadow-2xl";

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
  const [isLabelsVisible, setIsLabelsVisible] = useState<boolean>(true);
  const [selectedCirculation, setSelectedCirculation] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [hoveredPillImage, setHoveredPillImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  /** Keeps the image previews inside the free area to the right of the rail.
   *  The overlays are full-bleed (the dim backdrop should cover everything),
   *  but their *content* is centred in what is left after this padding, so the
   *  photo is never half-hidden under the glass panel - which is exactly what
   *  it looked like on a tablet, where the panel eats a bigger share of the
   *  screen. */
  const previewInset = {
    // the glass panel is a fixed w-72 (288px); the collapsed rail is ~6% wide
    paddingLeft: isSidebarOpen ? "clamp(304px, 22vw, 336px)" : "clamp(80px, 8vw, 112px)",
    paddingRight: "24px",
    paddingTop: "16px",
    // clears the floating bottom nav, which sits above these overlays
    paddingBottom: "88px",
    transition: "padding-left 300ms ease-in-out",
  } as const;

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
        onCirculationPrefetch={(item) => prefetchVideo(CIRCULATION_VIDEOS[item])}
        onOpenChange={setIsSidebarOpen}
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
                {isLabelsVisible && !selectedCirculation && (
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
                  isVisible={isLabelsVisible && !selectedCirculation}
                  onMouseEnter={() => {
                    if (marker.image) {
                      setHoveredPillImage(marker.image);
                    }
                  }}
                  onMouseLeave={() => setHoveredPillImage(null)}
                />
              </g>
            );
          })}

          {/* 2. New Separate Feature: Interactive Map Regions */}
          {activeInteractiveRegions.map((region) => {
            const points = parsePoints(region.polygon);
            if (!points) return null;

            return (
              <polygon
                key={region.id}
                points={points.map(p => `${p.x},${p.y}`).join(" ")}
                fill="rgba(255, 255, 255, 0.01)"
                stroke="transparent"
                strokeWidth={0}
                className="pointer-events-none"
              />
            );
          })}
        </svg>

        {/* Circulation video overlay */}
        <AnimatePresence mode="wait">
          {circulationVideo && (
            <motion.div
              key={circulationVideo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 z-40 pointer-events-auto"
            >
              <AutoVideo
                src={circulationVideo}
                className="absolute inset-0 size-full object-cover [filter:brightness(1.15)_contrast(1.08)_saturate(1.15)]"
              />
              <button
                type="button"
                onClick={() => setSelectedCirculation(null)}
                aria-label="Close circulation video"
                className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
              >
                <X className="size-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox / Modal for Image Preview */}
        {modalImage && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-40 flex items-center justify-center cursor-pointer"
            style={previewInset}
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative max-h-full w-auto max-w-full overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/60 p-1 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalImage}
                alt="Location Preview"
                decoding="async"
                className={PREVIEW_IMAGE_CLASS}
                onError={(e) => {
                  // Fallback restaurant interior if the image doesn't exist
                  e.currentTarget.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000";
                }}
              />
            </div>
          </div>
        )}

        {/* Central Hover Preview for Pills */}
        <AnimatePresence>
          {hoveredPillImage && (
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-40 flex items-center justify-center pointer-events-none"
              style={previewInset}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative max-h-full w-auto max-w-full overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/60 p-1 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)]"
              >
                <img
                  src={hoveredPillImage}
                  alt="Preview"
                  decoding="async"
                  className={PREVIEW_IMAGE_CLASS}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}