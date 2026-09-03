import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa6";
import { X } from "lucide-react";
const buildingImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/technical-page-building/orig";

const leedBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/leed-badge/card";
const wellBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/well-badge/card";
const igbcBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/igbc-badge/card";
const wiredscoreBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/wiredscore-badge/card";

const certificationsData = [
  {
    title: "LEED",
    subtitle: "Leadership in Energy & Environmental Design",
    badge: leedBadge,
    bullets: [
      "175 kWp Onsite Solar Generation",
      "EV Charging Infrastructure",
      "Water Efficiency & Conservation",
      "MERV 14 HVAC Filtration & CO₂ Monitors",
    ],
  },
  {
    title: "WELL",
    subtitle: "Built for Human Health & Wellbeing",
    badge: wellBadge,
    bullets: [
      "Enhanced Air Quality & Abundant Natural Light",
      "Showers, Lockers & Active Lifestyle Facilities",
      "Ergonomic, flexible & universally designed workspaces",
      "Ventilation Monitoring for Healthy Environment",
    ],
  },
  {
    title: "NET ZERO",
    subtitle: "Our Commitment to a Better Tomorrow",
    badge: igbcBadge,
    bullets: [
      "100% Renewable Energy Strategy (5.8 MWp planned)",
      "Water Reuse & Rainwater Harvesting (198 m³/day reused)",
      "Comprehensive waste segregation & recycling",
      "220 KLD MBR Sewage Treatment Plant",
    ],
  },
  {
    title: "WIRED SCORE",
    subtitle: "Future-Ready Digital Infrastructure",
    badge: wiredscoreBadge,
    bullets: [
      "Digital Resilience with Smart DCS Lifts",
      "4 Dedicated entry points for multiple ISPs",
      "Dual Power Source ensuring uninterrupted operations",
      "High-speed connectivity & seamless coverage in lifts/basement",
    ],
  },
];

const CertificationsPage = () => {
  const [activeDetail, setActiveDetail] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDetail(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeSection = activeDetail !== null ? certificationsData[activeDetail] : null;

  return (
    <div className="relative flex min-h-dvh lg:h-dvh w-full flex-col justify-between overflow-y-auto lg:overflow-hidden bg-[#0D2D43] px-6 pt-28 pb-20 sm:px-10 sm:pt-32 sm:pb-24 lg:px-14 lg:pt-36 lg:pb-24">
      {/* Background radial glow lights */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #C89D54 0%, transparent 70%)" }}
      />

      {/* Floating Circular Back Button */}
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C89D54]">CERTIFICATIONS</p>
            <h1 className="font-serif mt-1 text-3xl font-normal tracking-wide text-white sm:text-4xl">Certified Excellence</h1>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/70 font-light">
              Our commitment to sustainability, wellness and future-ready performance is validated by global standards.
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

        {/* Right: 4 Compact Cards (2x2 Grid) */}
        <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 lg:gap-5 min-h-0">
          {certificationsData.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + idx * 0.08 }}
              onClick={() => setActiveDetail(idx)}
              className="group relative flex cursor-pointer flex-col justify-start rounded-2xl border border-white/10 bg-[#071628]/40 p-5 lg:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl transition-all duration-300 hover:border-[#C89D54]/50 hover:bg-[#071628]/55 min-h-0"
            >
              {/* Card Header with emblem badge */}
              <div className="flex items-center gap-3.5">
                <img
                  src={section.badge}
                  alt={section.title}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain drop-shadow-md"
                />
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white leading-tight">{section.title}</h2>
                  <p className="text-[11px] sm:text-xs font-medium leading-tight text-[#C89D54]">{section.subtitle}</p>
                </div>
              </div>

              {/* Divider */}
              <span className="my-3 block h-px w-full bg-white/10" />

              {/* Bullets List */}
              <ul className="flex flex-col gap-2 text-xs leading-relaxed text-white/75 font-light">
                {section.bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#C89D54]" />
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
                <img src={activeSection.badge} alt={activeSection.title} className="h-14 w-14 shrink-0 object-contain drop-shadow-md" />
                <div>
                  <h2 className="text-2xl font-bold tracking-wide text-white">{activeSection.title}</h2>
                  <p className="mt-0.5 text-xs font-medium text-[#C89D54]">{activeSection.subtitle}</p>
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

export default CertificationsPage;
