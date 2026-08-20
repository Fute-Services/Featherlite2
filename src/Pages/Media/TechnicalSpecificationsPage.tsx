import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa6";

import pageBg from "../../assets/Media/page-bg.png";
import pointSvg from "../../assets/Media/point.svg";

import icon1 from "../../assets/Technical_Specification/1 Structure & Space Efficiency 1.png";
import icon2 from "../../assets/Technical_Specification/2 Facade & Thermal Efficiency 1.png";
import icon3 from "../../assets/Technical_Specification/3 Access Control & Security 1.png";
import icon4 from "../../assets/Technical_Specification/4 Back of the House Facilities 1.png";
import icon5 from "../../assets/Technical_Specification/5 Digital Resilience 1.png";
import icon6 from "../../assets/Technical_Specification/6 BMS & Fire Safety 1.png";
import icon7 from "../../assets/Technical_Specification/7 Utilities 1.png";
import icon8 from "../../assets/Technical_Specification/8 Sustainability & Innovation 1.png";

const specificationsData = [
  {
    title: "Structure & Space Efficiency",
    icon: icon1,
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
    title: "Facade & Thermal Efficiency",
    icon: icon2,
    items: [
      "Low U-value DGU glass reduces heat while maximizing natural light",
      "270-degree unobstructed view allow for extra light and ventilation",
      "Rain-simulating lighting creates a striking visual",
      "High performance LEED-rated DGU glass reduces heat gain and saves on operational costs",
    ],
  },
  {
    title: "Access Control & Security",
    icon: icon3,
    items: [
      "Separate entrance for the café, crèche, and restaurant with access control, ensuring security",
      "Pressurization systems in staircases, lift lobbies, and lift wells improve emergency egress and smoke control",
      "Refuge balconies on the 6th and 9th floors for emergency safety",
      "Independent vehicular entry and exit ramps with controlled circulation",
      "3-tier security system",
    ],
  },
  {
    title: "Back of the House Facilities",
    icon: icon4,
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
    title: "Digital Resilience",
    icon: icon5,
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
  {
    title: "BMS & Fire Safety",
    icon: icon6,
    items: [
      "Automated smoke vents enhance fire protection",
      "Fire safety following NBC standards and guidelines",
      "Intelligent BMS for real time monitoring for all equipment",
      "2-hour fire-rated structural elements",
      "Global Earthing System with tap-off points provided on each floor",
    ],
  },
  {
    title: "Utilities",
    icon: icon7,
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
    title: "Sustainability & Innovation",
    icon: icon8,
    items: [
      "Approx. 175 kW solar panels to power the common areas",
      "1 nos. X 500kg Organic Waste Collectors contribute to reducing landfill waste and lowering greenhouse gas emissions",
      "Complete segregation of waste and storage for disposal",
      "Provision up to 25% of total car parks including fast and slow EV charging stations in the basement",
      "Waste is segregated into glass, metal, e-waste, and other categories to ensure responsible recycling and disposal",
      "Planned offsite power generation: 5.8 MWp - 78,00463 kWhr/annum",
    ],
  },
];

const TechnicalSpecificationsPage = () => (
  <div className="relative w-full h-screen overflow-y-auto lg:overflow-hidden scrollbar-hide bg-[#0a2440]">
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

    <div className="relative z-10 flex min-h-screen w-full flex-col justify-center bg-[#0a2440] px-5 py-10 font-sans sm:px-8 lg:px-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 tracking-wide lg:mb-10"
        style={{ fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 500, color: "#D9B77C" }}
      >
        Technical Specifications
      </motion.h1>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-10 xl:gap-x-10">
        {specificationsData.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: (idx % 4) * 0.05 }}
            className="flex flex-col gap-2"
          >
            <img src={section.icon} alt={section.title} className="mb-1 h-[22px] w-[22px] object-contain" />

            <h2 className="font-medium tracking-wide text-white" style={{ fontSize: "clamp(13px, 1vw, 15px)" }}>
              {section.title}
            </h2>

            <ul className="mt-1 flex flex-col gap-1.5">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start font-light leading-snug text-white/85"
                  style={{ fontSize: "clamp(10px, 0.72vw, 11.5px)" }}
                >
                  <img src={pointSvg} alt="" className="mt-[5px] mr-2 w-[4px] flex-shrink-0 object-contain" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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

export default TechnicalSpecificationsPage;
