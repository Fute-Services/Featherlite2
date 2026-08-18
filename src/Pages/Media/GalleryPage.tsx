import { useState, useMemo, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState("exterior");
  const [allImages, setAllImages] = useState<any[]>([]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api.featherlitesignature.futeservices.in/api/gallery",
        );
        setAllImages(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const filteredImages = useMemo(() => {
    return allImages.find((img) => img.category === viewMode)?.images || [];
  }, [allImages, viewMode]);

  const redGradient = "linear-gradient(153deg, #8B0B01 16.82%, #F00 141.72%)";

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black font-sans">
      {/* BACK BUTTON — top-left on mobile/tablet, bottom-left on desktop */}
      <div className="fixed top-5 left-5 sm:top-8 sm:left-8 lg:top-auto lg:bottom-[50px] lg:left-[50px] z-50">
        <Link
          to="/media"
          className="flex items-center justify-center w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] lg:w-[42px] lg:h-[42px] rounded-full bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md border border-white/70 cursor-pointer hover:scale-105 transition-all"
        >
          <FaAngleLeft className="w-4 h-4 text-white/80" />
        </Link>
      </div>

      {/* TITLE */}
      <div className="absolute bottom-40 left-0 w-full z-40 flex flex-col items-center pointer-events-none px-4 text-center">
        <h2 className="text-white text-2xl md:text-3xl font-light tracking-[0.2em] uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          {filteredImages[activeIndex]?.title || "Loading..."}
        </h2>
        <div className="h-[2px] w-20 md:w-32 bg-white/40 mt-6" />
      </div>

      {/* SWIPER */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Swiper
          key={viewMode + filteredImages.length}
          effect={"coverflow"}
          centeredSlides={true}
          slidesPerView={1}
          loop={filteredImages.length > 2}
          speed={1000}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          coverflowEffect={{
            rotate: 0,
            stretch: 80,
            depth: 250,
            modifier: 1,
            slideShadows: true,
          }}
          onBeforeInit={(swiper) => {
            (swiper.params.navigation as any).prevEl = prevRef.current;
            (swiper.params.navigation as any).nextEl = nextRef.current;
          }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          modules={[EffectCoverflow, Navigation]}
          className="w-full h-full"
        >
          {filteredImages.map((img: any, index: number) => (
            <SwiperSlide key={index} className="w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={img.url || img.image}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* INTEGRATED CONTROLS CONTAINER */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center backdrop-blur-md bg-white/10 border border-white/20 p-2 rounded-full shadow-xl">
        {/* PREV BUTTON */}
        <button
          ref={prevRef}
          className="outline-none cursor-pointer p-1 transition-all duration-200 opacity-40 hover:opacity-70 active:opacity-100 active:scale-90"
        >
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
            style={{ background: redGradient }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </button>

        {/* CATEGORY SWITCHERS */}
        <div className="flex mx-2 bg-black/20 rounded-full p-1 border border-white/5">
          <button
            onClick={() => {
              setViewMode("interior");
              setActiveIndex(0);
            }}
            className={`px-4 sm:px-6 md:px-10 py-2 sm:py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-[0.15em] transition-all duration-500 uppercase active:scale-95 whitespace-nowrap`}
            style={{
              background:
                viewMode === "interior"
                  ? redGradient
                  : "rgba(139, 11, 1, 0.25)",
              color: "white",
              opacity: viewMode === "interior" ? 1 : 0.7,
              boxShadow:
                viewMode === "interior"
                  ? "0 4px 20px rgba(255,0,0,0.4)"
                  : "none",
            }}
          >
            Interior
          </button>

          <button
            onClick={() => {
              setViewMode("exterior");
              setActiveIndex(0);
            }}
            className={`px-4 sm:px-6 md:px-10 py-2 sm:py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-[0.15em] transition-all duration-500 uppercase active:scale-95 whitespace-nowrap`}
            style={{
              background:
                viewMode === "exterior"
                  ? redGradient
                  : "rgba(139, 11, 1, 0.25)",
              color: "white",
              opacity: viewMode === "exterior" ? 1 : 0.7,
              boxShadow:
                viewMode === "exterior"
                  ? "0 4px 20px rgba(255,0,0,0.4)"
                  : "none",
            }}
          >
            Exterior
          </button>
        </div>

        {/* NEXT BUTTON */}
        <button
          ref={nextRef}
          className="outline-none cursor-pointer p-1 transition-all duration-200 opacity-40 hover:opacity-70 active:opacity-100 active:scale-90"
        >
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
            style={{ background: redGradient }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .swiper-slide {
                    transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease !important;
                    opacity: 0.1;
                }
                .swiper-slide-active { opacity: 1 !important; z-index: 10; }
                .swiper-button-disabled { opacity: 0.1 !important; pointer-events: none; }
            `,
        }}
      />
    </div>
  );
}
