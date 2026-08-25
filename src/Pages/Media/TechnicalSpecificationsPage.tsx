import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";
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
    items: [
      "Flat slab structure with PT",
      "Floor-to-floor height: 4.05 m",
      "Central core to maximise natural lighting",
      "Flexible floor plates ranging from 10,000–40,000 sq. ft., offering 78±2% efficiency",
      "Designed for 1:62 sq. ft. carpet area occupancy",
      "11 X 11 m column spacing for optimized layouts",
      "Floor live load: 400 kg/sq.m and others: 330 kg/sq.m",
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
    items: [
      "Low U-value DGU glass reduces heat while maximizing natural light",
      "270-degree unobstructed view allow for extra light and ventilation",
      "Rain-simulating lighting creates a striking visual",
      "High performance LEED-rated DGU glass reduces heat gain and saves on operational costs",
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
    items: [
      "Separate entrance for the café, crèche, and restaurant with access control, ensuring security",
      "Pressurization systems in staircases, lift lobbies, and lift wells improve emergency egress and smoke control",
      "Refuge balconies on the 6th and 9th floors for emergency safety",
      "Independent vehicular entry and exit ramps with controlled circulation",
      "3-tier security system",
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
    items: [
      "Designated collection point for delivery packages",
      "Driver's rest room in basement",
      "Showers & lockers on the terrace",
      "Dedicated ODU location on each floor in the rear facade",
      "Toilets designed for an occupancy ratio of 1:60 sq. ft. on carpet",
      "Inclusion of gender-neutral and specially abled toilets",
      "Logistically designed for universal accessibility, including access ramps, tactile/braile guidance, and other assistive features",
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
    items: [
      "Automated smoke vents enhance fire protection",
      "Fire safety following NBC standards and guidelines",
      "Intelligent BMS for real time monitoring for all equipment",
      "2-hour fire-rated structural elements",
      "Global Earthing System with tap-off points provided on each floor",
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
    items: [
      "Hybrid HVAC with 2 nos. X 350 TR water cooled chiller and 1 no. 350 TR standby air-cooled chiller",
      "Screw compressor high delta chillers with VFD tech for high part load efficiency and energy saving",
      "MERV 14 filters ensure superior air quality",
      "Double-height lobbies add spaciousness",
      "220 KLD MBR Sewage Treatment Plant with the latest technology",
      "DG sets of 1 no. X 1500 kVA + 2 nos. X 750kVA",
      "Day tank sized 990 litres (4 day tank size) for diesel + 1 master tank",
      "Efficient 0.6kVA per sq. ft. power reduces unnecessary MD charges",
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
    items: [
      "Approx. 175 kW solar panels to power the common areas",
      "1 nos. X 500kg Organic Waste Collectors contribute to reducing landfill waste and lowering greenhouse gas emissions",
      "Complete segregation of waste and storage for disposal",
      "Provision up to 25% of total car parks including fast and slow EV charging stations in the basement",
      "Waste is segregated into glass, metal, e-waste, and other categories to ensure responsible recycling and disposal",
      "Planned offsite power generation: 5.8 MWp - 78,00463 kWhr/annum",
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
    items: [
      "8 high-speed elevators (27 passengers, 2.5m/s, MRL system)",
      "Smart Destination Control System lifts that optimize passenger flow and reduce wait times",
      "2 dedicated service lifts (1632kg) for smooth logistics",
      "Terrace spaces for future satellite connectivity",
      "2 dedicated entry points for 4 internet service providers",
      "WiFi in common areas",
      "Dual Power Source",
      "Mobile coverage in basement and lifts",
      "Backbone cabling for easy lease line access",
    ],
  },
];

const TechnicalSpecificationsPage = () => {
  const [activeDetail, setActiveDetail] = useState<number | null>(null);
  const activeSection = activeDetail !== null ? specificationsData[activeDetail] : null;
  const buttonRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());

  // Geometric hover check: the modal overlay covers the button once open, so
  // mouseenter/mouseleave on the button itself becomes unreliable. Instead,
  // track raw cursor position against the button's rect while a detail is open.
  useEffect(() => {
    if (activeDetail === null) return;
    const handleMouseMove = (e: MouseEvent) => {
      const btn = buttonRefs.current.get(activeDetail);
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!inside) setActiveDetail(null);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeDetail]);

  return (
    <div className="relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-[#0D2D43] pb-24 pt-28 sm:pb-28 sm:pt-32">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #C89D54 0%, transparent 70%)" }}
      />

      {/* Floating Back Button */}
      <div className="fixed bottom-6 left-6 z-[100] sm:bottom-8 sm:left-10">
        <Link
          to="/media"
          aria-label="Back to Media"
          className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-110 hover:border-[#C89D54] hover:text-[#C89D54]"
        >
          <FaAngleLeft className="size-4" />
        </Link>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-4 px-5 font-sans sm:px-8 lg:flex-row lg:gap-5 lg:px-10 min-h-0">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-3 lg:w-[240px] xl:w-[260px] lg:shrink-0 min-h-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C89D54]">TECHNICAL</p>
            <h1 className="font-serif mt-0.5 text-2xl font-normal text-white sm:text-3xl lg:text-4xl">Specifications</h1>
            <span className="mt-2 block h-[2px] w-10 bg-[#C89D54]" />
            <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-white/70">
              Engineered for performance, efficiency and long-term flexibility.
            </p>
          </motion.div>

          {/* Building photo at bottom-left seamlessly blending into background */}
          <div className="relative mt-3 hidden flex-1 overflow-hidden rounded-2xl lg:block min-h-0">
            <img src={buildingImg} alt="Featherlite Signature" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D2D43] via-transparent to-[#0D2D43]/40" />
          </div>
        </div>

        {/* Right Grid: 8 Cards (2 rows x 4 cols) */}
        <div className="grid flex-1 grid-cols-2 grid-rows-4 gap-2.5 sm:grid-cols-4 sm:grid-rows-2 lg:gap-3.5 min-h-0">
          {specificationsData.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: idx * 0.7 }}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#071628]/85 p-3 shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-[#C89D54]/50"
            >
              <div>
                {/* Top index number */}
                <span className="text-[10px] font-medium tracking-wider text-[#C89D54]">
                  {section.num}
                </span>

                {/* Circle Icon */}
                <div className="my-1.5 flex size-9 items-center justify-center rounded-full border border-[#C89D54]/60 bg-[#C89D54]/15 p-1.5">
                  <img src={section.icon} alt="" loading="lazy" decoding="async" className="h-5 w-5 object-contain brightness-0 invert" />
                </div>

                {/* Title */}
                <h2 className="font-serif text-xs font-normal text-white sm:text-sm line-clamp-2">
                  {section.title}
                </h2>

                <span className="my-1.5 block h-px w-full bg-white/10" />

                {/* Bullet Points */}
                <ul className="flex flex-col gap-1 text-[10px] text-white/70">
                  {section.bullets.map((item, i) => (
                    <li key={i} className="flex items-start gap-1 leading-tight">
                      <span className="mt-1 size-1 shrink-0 rounded-full bg-[#C89D54]" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View Details Link */}
              <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-white/5">
                <button
                  ref={(el) => {
                    buttonRefs.current.set(idx, el);
                  }}
                  type="button"
                  onClick={() => setActiveDetail(idx)}
                  onMouseEnter={() => setActiveDetail(idx)}
                  className="flex items-center gap-1 text-[10px] font-medium text-[#C89D54] transition-colors hover:text-white"
                >
                  View details
                  <ArrowRight size={11} />
                </button>
                <ArrowRight size={12} className="text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C89D54]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Modal */}
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
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#C89D54]/40 bg-[#C89D54]/10 p-2">
                  <img src={activeSection.icon} alt="" className="h-6 w-6 object-contain brightness-0 invert" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#C89D54]">{activeSection.num}</span>
                  <h2 className="font-serif text-2xl text-white">{activeSection.title}</h2>
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

export default TechnicalSpecificationsPage;
