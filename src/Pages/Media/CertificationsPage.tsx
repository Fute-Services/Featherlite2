import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa6";
import { ArrowRight, ChevronRight, X } from "lucide-react";

const buildingImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/home/signature-sunset/card";
const leedBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/leed-badge/card";
const wellBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/well-badge/card";
const igbcBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/igbc-badge/card";
const wiredscoreBadge = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/wiredscore-badge/card";
// Custom exact gold line-art SVG icons matching the design screenshot
const SolarPanelSunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <circle cx="12" cy="4.5" r="1.8" />
    <line x1="12" y1="1" x2="12" y2="1.8" />
    <line x1="8.5" y1="2.5" x2="9.5" y2="3.2" />
    <line x1="15.5" y1="2.5" x2="14.5" y2="3.2" />
    <line x1="12" y1="10" x2="12" y2="14" />
    <line x1="9" y1="14" x2="15" y2="14" />
    <polygon points="4,10 20,10 22,20 2,20" />
    <line x1="12" y1="10" x2="12" y2="20" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </svg>
);

const EVCarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <path d="M5 12h14a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-3a2 2 0 0 1 2-2z" />
    <path d="M7 12l1.5-4.5a2 2 0 0 1 1.9-1.5h3.2a2 2 0 0 1 1.9 1.5L17 12" />
    <path d="M11 13.5l-1 2h3l-1 2" />
  </svg>
);

const WaterDropIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <path d="M12 2.5C12 2.5 5 11 5 15.5C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.5C19 11 12 2.5 12 2.5Z" />
    <path d="M10 14c0 1.5 1 2.5 2.5 2.5" opacity="0.6" />
  </svg>
);

const AirQualityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <path d="M3 8h12a3 3 0 0 0 0-6 3 3 0 0 0-3 3" />
    <path d="M3 13h15a3 3 0 0 1 0 6 3 3 0 0 1-3-3" />
    <path d="M3 18h8a2 2 0 0 0 0-4" />
  </svg>
);

const SunRaysIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.9" y1="4.9" x2="7" y2="7" />
    <line x1="17" y1="17" x2="19.1" y2="19.1" />
    <line x1="4.9" y1="19.1" x2="7" y2="17" />
    <line x1="17" y1="7" x2="19.1" y2="4.9" />
  </svg>
);

const ShowerLockerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="12" cy="9" r="2" />
    <path d="M9 18v-4a3 3 0 0 1 6 0v4" />
    <path d="M12 4v2" />
  </svg>
);

const LightningCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <polygon points="12,6 8.5,13 12,13 11,18 15.5,11 12,11" />
  </svg>
);

const WaterReuseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <path d="M12 7c-2.5 0-4.5 3-4.5 5.5c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5C16.5 10 14.5 7 12 7z" />
    <path d="M12 2a10 10 0 0 1 9.5 7" />
    <polyline points="22 5 22 9 18 9" />
    <path d="M12 22a10 10 0 0 1-9.5-7" />
    <polyline points="2 19 2 15 6 15" />
  </svg>
);

const RecycleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <path d="M7 19l-4-7 2.2-3.8A2 2 0 0 1 6.9 7h10.2a2 2 0 0 1 1.7.9L21 12l-4 7" />
    <polyline points="11 21 7 19 8.5 15" />
    <polyline points="17 7 21 12 16.5 12" />
    <polyline points="3 12 5.2 8.2 9 10" />
  </svg>
);

const RadioTowerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <path d="M12 18l-5 4h10l-5-4z" />
    <line x1="12" y1="18" x2="12" y2="10" />
    <circle cx="12" cy="9" r="1.5" />
    <path d="M8.5 6.5a5 5 0 0 1 7 0" />
    <path d="M6 4a8.5 8.5 0 0 1 12 0" />
  </svg>
);

const ServerRacksIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <rect x="3" y="10" width="18" height="4" rx="1" />
    <rect x="3" y="16" width="18" height="4" rx="1" />
    <circle cx="7" cy="6" r="0.75" fill="#C89D54" />
    <circle cx="7" cy="12" r="0.75" fill="#C89D54" />
    <circle cx="7" cy="18" r="0.75" fill="#C89D54" />
    <line x1="16" y1="6" x2="19" y2="6" />
    <line x1="16" y1="12" x2="19" y2="12" />
    <line x1="16" y1="18" x2="19" y2="18" />
  </svg>
);

const WifiSignalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C89D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0">
    <path d="M5 12.55a11 11 0 0 1 14 0" />
    <path d="M8.5 16.1a7 7 0 0 1 7 0" />
    <circle cx="12" cy="19.5" r="1" fill="#C89D54" />
    <path d="M2 9a15 15 0 0 1 20 0" />
  </svg>
);

const certificationsData = [
  {
    title: "LEED",
    subtitle: "Leadership in Energy & Environmental Design",
    badge: leedBadge,
    highlights: [
      { text: "175 kWp Onsite Solar Generation", icon: SolarPanelSunIcon },
      { text: "EV Charging Infrastructure", icon: EVCarIcon },
      { text: "Water Efficiency & Conservation", icon: WaterDropIcon },
    ],
    items: [
      "175 kWp Onsite Solar Generation",
      "EV Charging Infrastructure",
      "Water Efficiency & Conservation",
      "Access to quality transit",
      "Bicycle/two-wheeler parking",
      "14 showers & changing rooms",
      "MERV 14 HVAC Filteration",
      "CO₂ Monitors in Ventilation",
    ],
  },
  {
    title: "WELL",
    subtitle: "Built for Human Health & Wellbeing",
    badge: wellBadge,
    highlights: [
      { text: "Enhanced Air Quality", icon: AirQualityIcon },
      { text: "Abundant Natural Light", icon: SunRaysIcon },
      { text: "Showers, Lockers & Active Lifestyle Facilities", icon: ShowerLockerIcon },
    ],
    items: [
      "Enhanced Air Quality",
      "Abundant Natural Light",
      "Showers, Lockers & Active Lifestyle Facilities",
      "Ventilation Monitoring for Healthy Indoor Environment",
      "Ergonomic and flexible workspaces",
      "Spaces and policies promoting mental well-being",
      "Inclusive, accessible, and universally designed spaces",
    ],
  },
  {
    title: "NET ZERO",
    subtitle: "Our Commitment to a Better Tomorrow",
    badge: igbcBadge,
    highlights: [
      { text: "100% Renewable Energy Strategy", icon: LightningCircleIcon },
      { text: "Water Reuse & Rainwater Harvesting", icon: WaterReuseIcon },
      { text: "Waste Segregation & Responsible Disposal", icon: RecycleIcon },
    ],
    items: [
      "100% Renewable Energy Strategy",
      "Water Reuse & Rainwater Harvesting",
      "Waste Segregation & Responsible Disposal",
      "Onsite renewable energy generation (175 kWp solar)",
      "Water Required: 232 m³/day, reused after treatment: 198 m³/day",
      "Terrace rain water tank of 200 m³",
      "Surface rain water tank of 100 m³",
      "Recharge pits of 10 nos with overall capacity of 35 cum planned",
    ],
  },
  {
    title: "WIRED SCORE",
    subtitle: "Future-Ready Digital Infrastructure",
    badge: wiredscoreBadge,
    highlights: [
      { text: "Digital Resilience with DCS", icon: RadioTowerIcon },
      { text: "Multiple ISP Connectivity", icon: ServerRacksIcon },
      { text: "High-Speed Connectivity & Coverage", icon: WifiSignalIcon },
    ],
    items: [
      "Digital Resilience with DCS",
      "Multiple ISP Connectivity",
      "High-Speed Connectivity & Coverage",
      "Smart Destination Control System (DCS) lifts optimizing flow & reducing wait times",
      "Dual power source ensuring uninterrupted operations",
      "Terrace provisions for future satellite connectivity",
      "4 dedicated entry points for diverse internet service providers",
      "Backbone cabling for easy lease line access",
      "Seamless Mobile Coverage, including in basements & lifts",
      "WiFi enabled common areas for tenant convenience",
    ],
  },
];

const CertificationsPage = () => {
  const [activeDetail, setActiveDetail] = useState<number | null>(null);
  const activeSection = activeDetail !== null ? certificationsData[activeDetail] : null;

  return (
    <div className="relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-[#040C18] pb-28 pt-28 sm:pb-32 sm:pt-32">
      {/* Background radial glow lights */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #C89D54 0%, transparent 70%)" }}
      />

      {/* Floating Circular Back Button (Bottom-left) */}
      <div className="fixed bottom-6 left-6 z-[100] sm:bottom-8 sm:left-10">
        <Link
          to="/media"
          aria-label="Back to Media"
          className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-110 hover:border-[#C89D54] hover:text-[#C89D54]"
        >
          <FaAngleLeft className="size-4" />
        </Link>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-4 px-5 font-sans sm:px-8 lg:flex-row lg:gap-6 lg:px-10 min-h-0">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-3 lg:w-[260px] xl:w-[280px] lg:shrink-0 min-h-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C89D54]">CERTIFICATIONS</p>
            <h1 className="font-serif mt-0.5 text-2xl font-normal text-white sm:text-3xl">Certified Excellence</h1>
            <span className="mt-2 block h-[2px] w-10 bg-[#C89D54]" />
            <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-white/70">
              Our commitment to sustainability, wellness and future-ready performance is validated by global standards.
            </p>
          </motion.div>

          {/* Building photo at bottom-left seamlessly blending into background */}
          <div className="relative mt-3 hidden flex-1 overflow-hidden rounded-2xl lg:block min-h-0">
            <img src={buildingImg} alt="Featherlite Signature" loading="lazy" decoding="async" className="h-full w-full object-cover object-bottom" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040C18] via-transparent to-[#040C18]/40" />
          </div>
        </div>

        {/* Right: 4 Compact Cards (2x2 Grid) */}
        <div className="grid flex-1 grid-cols-1 grid-rows-2 gap-3 sm:grid-cols-2 lg:gap-3.5 min-h-0">
          {certificationsData.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#071628]/85 p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[#C89D54]/50 sm:p-4"
            >
              <div>
                {/* Header with emblem badge logo */}
                <div className="flex items-center gap-3">
                  <img
                    src={section.badge}
                    alt={section.title}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 shrink-0 object-contain drop-shadow-md sm:h-11 sm:w-11"
                  />
                  <div>
                    <h2 className="font-serif text-lg font-normal text-white sm:text-xl">{section.title}</h2>
                    <p className="text-[10px] font-medium leading-tight text-[#C89D54]">{section.subtitle}</p>
                  </div>
                </div>

                <span className="my-1.5 block h-px w-full bg-white/10" />

                {/* Highlights List with custom gold SVG icons */}
                <ul className="flex flex-col gap-1 py-0.5">
                  {section.highlights.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <li key={i} className="flex items-center gap-2 text-[10px] leading-tight text-white/85">
                        <span className="flex size-4 shrink-0 items-center justify-center text-[#C89D54]">
                          <Icon />
                        </span>
                        <span className="line-clamp-1">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Bottom bar */}
              <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveDetail(idx)}
                  className="flex items-center gap-1.5 text-[10px] font-medium text-[#C89D54] transition-colors hover:text-white"
                >
                  View details
                  <ArrowRight size={11} />
                </button>
                <ChevronRight size={13} className="text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C89D54]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail modal for expanded items */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setActiveDetail(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#071628] p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setActiveDetail(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full bg-[#FF0000] p-1.5 text-white shadow-lg transition-colors hover:bg-red-700"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-4 pr-8">
                <img src={activeSection.badge} alt={activeSection.title} className="h-14 w-14 shrink-0 object-contain" />
                <div>
                  <h2 className="font-serif text-2xl text-white">{activeSection.title}</h2>
                  <p className="mt-0.5 text-xs font-medium text-[#C89D54]">{activeSection.subtitle}</p>
                </div>
              </div>

              <span className="mt-4 block h-px w-full bg-white/10" />

              <ul className="mt-4 flex flex-col gap-2.5">
                {activeSection.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-snug text-white/85">
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
