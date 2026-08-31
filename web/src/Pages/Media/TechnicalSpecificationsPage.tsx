import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa6";
import { X } from "lucide-react";
import buildingImg from "../../assets/Media/technical-page-building.jpg";

const icon1 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/1-structure-space-efficiency-1/card";
const icon2 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/2-facade-thermal-efficiency-1/card";
const icon3 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/3-access-control-security-1/card";
const icon4 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/4-back-of-the-house-facilities-1/card";
const icon5 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/5-digital-resilience-1/card";
const icon6 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/6-bms-fire-safety-1/card";
const icon7 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/7-utilities-1/card";
const icon8 = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/technical-specification/8-sustainability-innovation-1/card";

const specificationsData = [
  {
    num: "01",
    title: "Structure & Space Efficiency",
    icon: icon1,
    bullets: [
      "4.05 m floor-to-floor height",
      "Up to 78–82% efficiency",
      "Flexible floor plates",
    ],
  },
  {
    num: "02",
    title: "Facade & Thermal Efficiency",
    icon: icon2,
    bullets: [
      "Low U-value DGU glass",
      "270° unobstructed views",
      "High thermal performance",
    ],
  },
  {
    num: "03",
    title: "Access Control & Security",
    icon: icon3,
    bullets: [
      "3-tier security system",
      "Access-controlled entry",
      "Refuge balconies on floors",
    ],
  },
  {
    num: "04",
    title: "Back of the House Facilities",
    icon: icon4,
    bullets: [
      "Dedicated service lift",
      "Driver's rest room in basement",
      "Toilets for differently abled",
    ],
  },
  {
    num: "05",
    title: "BMS & Fire Safety",
    icon: icon6,
    bullets: [
      "Addressable fire detection",
      "Intelligent BMS system",
      "2-hour fire-rated structure",
    ],
  },
  {
    num: "06",
    title: "Utilities",
    icon: icon7,
    bullets: [
      "Hybrid HVAC system",
      "100% DG backup",
      "Water-efficient fixtures",
      "STP for water recycling",
    ],
  },
  {
    num: "07",
    title: "Sustainability & Innovation",
    icon: icon8,
    bullets: [
      "Solar power generation",
      "EV charging stations",
      "Waste segregation",
      "Low VOC materials",
    ],
  },
  {
    num: "08",
    title: "Digital Infrastructure",
    icon: icon5,
    bullets: [
      "High-speed connectivity",
      "Dual ISP & redundancy",
      "Future-ready cabling infrastructure",
    ],
  },
];

const TechnicalSpecificationsPage = () => {
  const [activeDetail, setActiveDetail] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDetail(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeSection = activeDetail !== null ? specificationsData[activeDetail] : null;

  return (
    <div className="relative flex min-h-dvh lg:h-dvh w-full flex-col justify-between overflow-y-auto lg:overflow-hidden bg-[#0D2D43] px-6 pt-28 pb-20 sm:px-10 sm:pt-32 sm:pb-24 lg:px-14 lg:pt-36 lg:pb-24">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #C89D54 0%, transparent 70%)" }}
      />

      {/* Floating Back Button */}
      <div className="fixed bottom-6 left-6 z-[100] sm:bottom-8 sm:left-8">
        <Link
          to="/media"
          aria-label="Back to Media"
          className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#C89D54] hover:text-[#C89D54]"
        >
          <FaAngleLeft className="size-4" />
        </Link>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col gap-6 lg:flex-row lg:gap-8 min-h-0">
        {/* Left Sidebar */}
        <div className="flex flex-col justify-between lg:w-[260px] xl:w-[290px] lg:shrink-0 min-h-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C89D54]">TECHNICAL</p>
            <h1 className="font-serif mt-1 text-3xl font-normal tracking-wide text-white sm:text-4xl">Specifications</h1>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/70 font-light">
              Engineered for performance, efficiency and long-term flexibility.
            </p>
          </motion.div>

          {/* Building photo at bottom-left seamlessly blending into background */}
          <div className="relative mt-4 hidden flex-1 overflow-hidden rounded-2xl lg:block min-h-0 max-h-[340px]">
            <img
              src={buildingImg}
              alt="Featherlite Signature"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top rounded-2xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#0D2D43] via-transparent to-[#0D2D43]/40" />
          </div>
        </div>

        {/* Right Grid: 8 Cards (2 rows x 4 cols on desktop) */}
        <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3.5 lg:gap-4 min-h-0">
          {specificationsData.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 + idx * 0.06 }}
              onClick={() => setActiveDetail(idx)}
              className="group relative flex cursor-pointer flex-col justify-start rounded-2xl border border-white/10 bg-[#071628]/40 p-4 lg:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl transition-all duration-300 hover:border-[#C89D54]/50 hover:bg-[#071628]/55 min-h-0"
            >
              {/* Top Row: Index number */}
              <span className="text-[10px] font-medium tracking-wider text-[#C89D54]">
                {section.num}
              </span>

              {/* Circle Icon */}
              <div className="my-2 flex size-8 items-center justify-center rounded-full border border-[#C89D54]/60 bg-[#C89D54]/15 p-1.5">
                <img
                  src={section.icon}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-4 w-4 object-contain brightness-0 invert"
                />
              </div>

              {/* Title */}
              <h2 className="font-serif text-sm sm:text-base font-normal text-white line-clamp-1 leading-snug">
                {section.title}
              </h2>

              {/* Divider */}
              <span className="my-2.5 block h-px w-full bg-white/10" />

              {/* Bullet Points */}
              <ul className="flex flex-col gap-1.5 text-[11px] leading-tight text-white/75 font-light">
                {section.bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 size-1 shrink-0 rounded-full bg-[#C89D54]" />
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail modal on click */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setActiveDetail(null)}
            className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          >
            <motion.div
              key={activeDetail}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#C89D54]/30 bg-[#071628]/95 p-6 shadow-[0_20px_60px_0_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-8"
            >
              <button
                onClick={() => setActiveDetail(null)}
                className="absolute top-5 right-5 z-10 rounded-full border border-white/20 bg-white/10 p-2 text-white/80 transition-all hover:bg-white/20 hover:text-white"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-4 pr-10">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#C89D54]/60 bg-[#C89D54]/15 p-2.5">
                  <img src={activeSection.icon} alt="" className="h-full w-full object-contain brightness-0 invert" />
                </div>
                <div>
                  <span className="text-[10px] font-medium tracking-wider text-[#C89D54]">{activeSection.num}</span>
                  <h2 className="text-xl font-bold tracking-wide text-white">{activeSection.title}</h2>
                </div>
              </div>

              <span className="mt-4 block h-px w-full bg-white/15" />

              <ul className="mt-4 flex flex-col gap-2.5">
                {activeSection.bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-snug text-white/90">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#C89D54]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicalSpecificationsPage;
