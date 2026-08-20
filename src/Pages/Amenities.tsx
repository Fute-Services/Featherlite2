import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type LucideIcon } from "lucide-react";

const buildingImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/availabilitypage/building/public";
import outsideLineImg from "../assets/AvailabilityPage/lines/outside_line.svg";
import cafeLineImg from "../assets/AvailabilityPage/lines/cafe.svg";
import tableTennisLineImg from "../assets/AvailabilityPage/lines/table tennis.svg";
import crecheLineImg from "../assets/AvailabilityPage/lines/creache.svg";
import cuttingEdgeLineImg from "../assets/AvailabilityPage/lines/cutting edge.svg";
import restaurantLineImg from "../assets/AvailabilityPage/lines/resturant.svg";
import visitorCarLineImg from "../assets/AvailabilityPage/lines/visitor car.svg";
import doubleHeightLineImg from "../assets/AvailabilityPage/lines/Double hight.svg";
import kioskIconImg from "../assets/AvailabilityPage/icons/Kiosk on Wheels.svg";
import foodIconImg from "../assets/AvailabilityPage/icons/Food.svg";
// import travelerIconImg from "../assets/AvailabilityPage/icons/Traveler.svg";
import tableTennisIconImg from "../assets/AvailabilityPage/icons/Table Tennis.svg";
import stadiumIconImg from "../assets/AvailabilityPage/icons/Stadium.svg";
import doubleHeightIconImg from "../assets/AvailabilityPage/icons/Height.svg";
import cafeIconImg from "../assets/AvailabilityPage/icons/Cafe.svg";
import outdoorSeatingIconImg from "../assets/AvailabilityPage/icons/Park Bench.svg";
import parkingIconImg from "../assets/AvailabilityPage/icons/Parking.svg";
import restaurantIconImg from "../assets/AvailabilityPage/icons/Restaurant.svg";
import crecheIconImg from "../assets/AvailabilityPage/icons/Day Care.svg";
import seesawIconImg from "../assets/AvailabilityPage/icons/Seesaw.svg";
import cuttingEdgeIconImg from "../assets/AvailabilityPage/icons/3D Model.svg";

// @ts-ignore
const cafeteriaImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/cafeteria-250226/public";
// @ts-ignore
const kidsPlayPopupImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/copy-of-kids-play/public";
// @ts-ignore
const crecheImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/creche/public";
// @ts-ignore
const receptionImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/double-height-reception/public";
// @ts-ignore
const multipurposeImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/multipurpose-court/public";
// @ts-ignore
const outdoorSeatingImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/outdoor-seating-zone/public";
// @ts-ignore
const restaurantImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/restaurant/public";
// @ts-ignore
const rooftopLunchImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/rooftop-lunch-cafe/public";
// @ts-ignore
const servingKioskImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/serving-kiosk/public";
// @ts-ignore
const tableTennisImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/table-tennis/public";
// @ts-ignore
const evChargeImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/amenities/popup/ev-charge/public";
// @ts-ignore
import ledScreenVideo from "../assets/amenities/popup/LED Screeng-yQ5wbJr5.mp4";



// ─── Constants ───────────────────────────────────────────────────────────────
const GOLD = "#CDAE7F";
const ICON_COLOR = "#4A2800";
const CIRCLE_R = 20;

// viewBox matches exactly with 1920x1407 image dimensions for perfect coordinate mapping with building.png
const VB_W = 1920;
const VB_H = 1407;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Amenity {
  id: string;
  label: string[];
  cx: number;
  cy: number;
  /** Optional SVG polyline points string connecting circle edge → building */
  linePts?: string;
  /** Optional custom SVG image to use instead of a polyline */
  lineSvg?: string;
  /** The X, Y, Width, and Height of the SVG line (from Figma) */
  lineSvgProps?: { x: number; y: number; w: number; h: number };
  labelPos?: "top" | "left" | "right" | "bottom";
  thumbnailPos?: "top" | "left" | "right" | "bottom";
  Icon?: LucideIcon;
  customIcon?: string;
  delay: number;
  /** Optional polygon points to highlight an area on the building */
  polygon?: string;
  image?: string;
  video?: string;
}

// ─── Amenity Data ─────────────────────────────────────────────────────────────
// All positions (cx, cy) are scaled for the 1200x629 coordinate space
const amenities: Amenity[] = [
  {
    id: "serving-kiosk",
    label: ["Serving Kiosk"],
    cx: 860,
    cy: 260,
    linePts: "858,320,858,286",
    labelPos: "top",
    thumbnailPos: "left",
    customIcon: kioskIconImg,
    delay: 0,
    image: servingKioskImg,
  },
  {
    id: "rooftop-cafe",
    label: ["Rooftop Lunch Cafe"],
    cx: 1015,
    cy: 300,
    thumbnailPos: "bottom",
    linePts: "1015,373,1014,331",
    labelPos: "top",
    customIcon: foodIconImg,
    delay: 0.1,
    image: rooftopLunchImg,
  },
  // {
  //   id: "walkway",
  //   label: ["Walk Way"],
  //   cx: 1119,
  //   cy: 470,
  //   linePts: "1119,509,1119,559",
  //   labelPos: "top",
  //   customIcon: travelerIconImg,
  //   delay: 0.15,
  //   image: exploreImg,
  // },
  {
    id: "table-tennis",
    label: ["Table Tennis"],
    cx: 1370,
    cy: 400,
    lineSvg: tableTennisLineImg,
    lineSvgProps: { x: 1260, y: 403, w: 220, h: 167 },
    labelPos: "top",
    customIcon: tableTennisIconImg,
    delay: 0.2,
    image: tableTennisImg,
  },
  {
    id: "multipurpose-court",
    label: ["Multipurpose Court"],
    cx: 1480,
    cy: 400,
    // Straight horizontal line connecting to the Table Tennis icon:
    // Point 1 (Start near icon) : 1584,413
    // Point 2 (End at Table Tennis icon) : 1496,413
    linePts: "1370,407,1456,407",
    labelPos: "top",
    customIcon: stadiumIconImg,
    delay: 0.25,
    image: multipurposeImg,
  },
  {
    id: "3d-led-screen",
    label: ["Cutting Edge", "3D LED Screen"],
    cx: 560,
    cy: 480,
    lineSvg: cuttingEdgeLineImg,
    lineSvgProps: { x: 580, y: 410, w: 300, h: 180 },
    labelPos: "top",
    customIcon: cuttingEdgeIconImg,
    delay: 0.3,
    video: ledScreenVideo,
  },
  {
    id: "kids-play",
    label: ["Outdoor", "Kids Play"],
    cx: 631,
    cy: 733,
    thumbnailPos: "left",
    // linePts: "610,910 722,919",
    labelPos: "top",
    customIcon: seesawIconImg,
    delay: 0.35,
    image: kidsPlayPopupImg,
  },
  {
    id: "creche",
    label: ["Creche"],
    cx: 717,
    cy: 733,
    thumbnailPos: "right",
    lineSvg: crecheLineImg,
    lineSvgProps: { x: 600, y: 738, w: 280, h: 130 },
    labelPos: "top",
    customIcon: crecheIconImg,
    delay: 0.4,
    image: crecheImg,
  },
  {
    id: "restaurant",
    label: ["Restaurant"],
    cx: 660,
    cy: 850,
    thumbnailPos: "right",
    lineSvg: restaurantLineImg,
    lineSvgProps: { x: 660, y: 810, w: 200, h: 130 },
    labelPos: "top",
    customIcon: restaurantIconImg,
    delay: 0.45,
    image: restaurantImg,
  },
  {
    id: "parking",
    label: ["Vistors Car Parking", "With EV charging"],
    cx: 670,
    cy: 935,
    thumbnailPos: "right",
    lineSvg: visitorCarLineImg,
    lineSvgProps: { x: 690, y: 898, w: 100, h: 50 },
    labelPos: "left",
    customIcon: parkingIconImg,
    delay: 0.5,
    image: evChargeImg,
  },
  {
    id: "double-height-lobbies",
    label: ["Double Height Lobbies", "on alternate Floors"],
    cx: 1340,
    cy: 710,
    thumbnailPos: "right",
    lineSvg: doubleHeightLineImg,
    lineSvgProps: { x: 1020, y: 600, w: 280, h: 150 },
    labelPos: "top",
    customIcon: doubleHeightIconImg,
    delay: 0.55,
    image: receptionImg,
  },
  {
    id: "cafe",
    label: ["Cafe"],
    cx: 1376,
    cy: 810,
    lineSvg: cafeLineImg,
    thumbnailPos: "right",
    // Replace x, y, w, h with the exact bounding box from Figma!
    lineSvgProps: { x: 1229, y: 810, w: 150, h: 90 },
    labelPos: "top",
    customIcon: cafeIconImg,
    delay: 0.6,
    image: cafeteriaImg,
  },
  {
    id: "outdoor-seating",
    label: ["Outdoor Seating Zone"],
    cx: 1480,
    cy: 870,
    lineSvg: outsideLineImg,
    // Replace x, y, w, h with the exact bounding box from Figma!
    thumbnailPos: "left",
    lineSvgProps: { x: 1296, y: 890, w: 181, h: 50 },
    labelPos: "right",
    customIcon: outdoorSeatingIconImg,
    delay: 0.65,
    image: outdoorSeatingImg,
  },
];

const getLabelProps = (pos: "top" | "left" | "right" | "bottom" = "top", cx: number, cy: number, w = 240) => {
  switch (pos) {
    case "top":
      return { x: cx - w / 2, y: cy - 96, width: w, height: 65, justify: "flex-end", textAlign: "center" as const };
    case "bottom":
      return { x: cx - w / 2, y: cy + 28, width: w, height: 65, justify: "flex-start", textAlign: "center" as const };
    case "left":
      return { x: cx - w - 28, y: cy - 32, width: w, height: 65, justify: "center", textAlign: "right" as const };
    case "right":
      return { x: cx + 28, y: cy - 32, width: w, height: 65, justify: "center", textAlign: "left" as const };
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
const Amenities = () => {
  const [hoveredAmenity, setHoveredAmenity] = useState<string | null>(null);

  const hoveredAmenityData = amenities.find((a) => a.id === hoveredAmenity);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 font-sans">

      {/* ── BUILDING & HOTSPOTS WRAPPER (shifted 100px down, no top gap) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ top: "-100px", height: "calc(100% + 100px)", transform: "translateY(100px)" }}
      >
        {/* ── BUILDING IMAGE (static) ───────────────────────────────────── */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <img
            src={buildingImg}
            alt="Featherlite Signature Building"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── AMENITY HOTSPOT SVG OVERLAY ────────────────────────────────── */}
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 w-full h-full z-30 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="paint0_linear_759_9243" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop stopColor="white" />
              <stop offset="1" stopColor="#CDAE7F" />
            </linearGradient>
          </defs>

          {amenities.map(({ id, label, cx, cy, linePts, lineSvg, lineSvgProps, labelPos, Icon, customIcon, polygon }) => (
            <g
              key={id}
              onMouseEnter={() => setHoveredAmenity(id)}
              onMouseLeave={() => setHoveredAmenity(null)}
              className="pointer-events-auto"
            >
              {/* Optional Highlight Polygon */}
              {polygon && (
                <polygon
                  points={polygon}
                  className={`transition-colors duration-300 cursor-pointer ${hoveredAmenity === id ? 'fill-[#CDAE7F]/40' : 'fill-white/0'
                    }`}
                />
              )}

              {/* Connector line or Custom SVG Image */}
              {lineSvg && lineSvgProps ? (
                <image
                  href={lineSvg}
                  x={lineSvgProps.x}
                  y={lineSvgProps.y}
                  width={lineSvgProps.w}
                  height={lineSvgProps.h}
                  pointerEvents="none"
                />
              ) : linePts ? (
                <polyline
                  points={linePts}
                  stroke={GOLD}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pointerEvents="none"
                />
              ) : null}

              {/* Golden circle */}
              <circle cx={cx} cy={cy} r={CIRCLE_R} fill={GOLD} />

              {/* Lucide icon centered in circle */}
              <foreignObject
                x={cx - 20}
                y={cy - 20}
                width={40}
                height={40}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  {customIcon ? (
                    <img src={customIcon} alt={id} style={{ width: 24, height: 24, objectFit: "contain" }} />
                  ) : Icon ? (
                    <Icon size={20} color={ICON_COLOR} strokeWidth={2.5} />
                  ) : null}
                </div>
              </foreignObject>

              {/* Label text */}
              {(() => {
                const lp = getLabelProps(labelPos, cx, cy);
                return (
                  <foreignObject
                    x={lp.x}
                    y={lp.y}
                    width={lp.width}
                    height={lp.height}
                    pointerEvents="none"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: lp.justify,
                        height: "100%",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "1.45",
                        textAlign: lp.textAlign,
                        letterSpacing: "0.025em",
                        textShadow:
                          "0 1px 4px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.7)",
                        whiteSpace: "nowrap",
                        fontFamily: '"Nortica Typeface", sans-serif',
                      }}
                    >
                      {label.map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </foreignObject>
                );
              })()}

              {/* Dynamic Thumbnail on Hover (Removed in favor of central hover preview) */}
            </g>
          ))}
        </svg>
      </div>

      {/* ── CENTRAL HOVER PREVIEW MODAL ────────────────────────────────── */}
      <AnimatePresence>
        {hoveredAmenityData && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-40 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/60 p-1 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)]"
            >
              {hoveredAmenityData.video ? (
                <video
                  src={hoveredAmenityData.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
                />
              ) : (
                <img
                  src={hoveredAmenityData.image}
                  alt={hoveredAmenityData.label.join(" ")}
                  decoding="async"
                  className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default Amenities;
