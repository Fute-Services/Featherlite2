import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa6";
import { CheckCircle2 } from "lucide-react";

import pageBg from "../../assets/Media/page-bg.png";
import leedBadge from "../../assets/Media/leed-badge.png";
import wellBadge from "../../assets/Media/well-badge.png";
import igbcBadge from "../../assets/Media/igbc-badge.png";
import wiredscoreBadge from "../../assets/Media/wiredscore-badge.png";

const wiredscoreSubheaders = ["Digital-Connectivity And Coverage", "Digital Services"];

const specificationsData = [
  {
    title: "LEED Highlights",
    badge: leedBadge,
    items: [
      "Access to quality transit",
      "Bicycle/two-wheeler parking",
      "14 showers & changing rooms",
      "100 KL Surface runoff water tank",
      "200 KL Rooftop rainwater tank",
      "Low-flow CP & Sanitary Fixtures",
      "175 kWp onsite Solar Generator",
      "MERV 14 HVAC Filteration",
      "CO₂ Monitors in Ventilation",
      "EV Charging Infrastructure",
    ],
  },
  {
    title: "WELL Features",
    badge: wellBadge,
    items: [
      "Showers & Locker facilities supporting active lifestyle",
      "Enhanced Air Quality with Advanced Filtration",
      "Ventilation Monitoring for Healthy Indoor Environment",
      "Enhanced access to natural light indoors",
      "Ergonomic and flexible workspaces",
      "Spaces and policies promoting mental well-being",
      "Inclusive, accessible, and universally designed spaces",
    ],
  },
  {
    title: "Net Zero Commitments",
    badge: igbcBadge,
    items: [
      "Onsite renewable energy generation (175 kWp solar)",
      "Proposed regulated off grid renewable energy generation - 78,00463 kWhr/annum",
      "Together, onsite + offsite renewables cover 100% of energy needs",
      "Water Required: 232 m³/day",
      "Reused after treatment: 198 m³/day",
      "Terrace rain water tank of 200 m³",
      "Surface rain water tank of 100 m³",
      "Recharge pits of 10 nos with overall capacity of 35 cum planned",
    ],
  },
  {
    title: "Wiredscore Standards",
    badge: wiredscoreBadge,
    items: [
      "Smart Destination Control System (DCS) lifts optimizing flow & reducing wait times",
      "Dual power source ensuring uninterrupted operations",
      "Terrace provisions for future satellite connectivity",
      "4 dedicated entry points for diverse internet service providers",
      "Backbone cabling for easy lease line access",
      "Digital-Connectivity And Coverage",
      "High-Capacity Infrastructure supporting multiple ISP's",
      "Seamless Mobile Coverage, including in basements & lifts",
      "WiFi enabled common areas for tenant convenience",
      "Digital Services",
      "Potential for tenant digital platforms (access, visitor management, amenity booking)",
      "Technology ready design enabling next gen digital solutions",
    ],
  },
];

const CertificationsPage = () => {
  const renderItems = (items: string[], sectionIdx: number) => {
    if (sectionIdx !== 3) {
      return items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-[12px] md:text-[13px] lg:text-[13.5px] font-normal leading-snug text-white/90"
        >
          <CheckCircle2 className="mt-[3px] w-[13px] h-[13px] lg:w-[15px] lg:h-[15px] flex-shrink-0 text-[#60A5FA]" />
          <span>{item}</span>
        </li>
      ));
    }

    return [
      <li key="header-digital-resilience" className="mt-2 mb-1 text-[12px] font-medium text-white first:mt-0 md:text-[13px] lg:text-[13.5px]">
        Digital Resilience
      </li>,
      ...items.map((item, i) =>
        wiredscoreSubheaders.includes(item) ? (
          <li key={i} className="mt-3 mb-1 text-[12px] font-medium text-white md:text-[13px] lg:text-[13.5px]">
            {item}
          </li>
        ) : (
          <li key={i} className="flex items-start gap-1.5 pl-1 text-[11px] font-normal leading-snug text-white/80 md:text-[12px] lg:text-[12.5px]">
            <span className="mt-[2px]">&bull;</span>
            <span>{item}</span>
          </li>
        )
      ),
    ];
  };

  return (
    <div className="relative w-full h-screen overflow-y-auto scrollbar-hide bg-[#0a2440]">
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${pageBg})` }}
      />

      <div className="fixed top-5 left-5 sm:top-8 sm:left-8 lg:top-auto lg:bottom-8 lg:left-8 z-50">
        <Link
          to="/media"
          className="relative flex items-center justify-center w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] lg:w-[40px] lg:h-[40px] rounded-full border border-white/[0.1] bg-black/45 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150 cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:bg-[rgba(231,33,0,0.24)] active:scale-95"
        >
          <FaAngleLeft className="w-4 h-4 text-white/85" />
        </Link>
      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col px-5 pt-6 pb-16 font-sans sm:px-8 sm:pt-8 lg:px-10 lg:pb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 w-fit border-b border-[#D9B77C]/50 pb-2 tracking-wide lg:mb-10"
          style={{ fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 500, color: "#D9B77C" }}
        >
          Our Certifications
        </motion.h1>

        <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0 xl:gap-x-10">
          {specificationsData.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: (idx % 4) * 0.1 }}
              className="flex flex-col gap-2"
            >
              <img src={section.badge} alt={section.title} className="mb-2 h-[64px] w-[64px] object-contain lg:h-[70px] lg:w-[70px]" />

              <h2 className="mb-1 font-medium tracking-wide" style={{ fontSize: "clamp(14px, 1.2vw, 18px)", color: "#D9B77C" }}>
                {section.title}
              </h2>

              <ul className="flex flex-col gap-1.5">{renderItems(section.items, idx)}</ul>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CertificationsPage;
