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

      {/* INTEGRATED CONTROLS CONTAINER - black liquid glass, matching the bottom Navbar */}
      <div className="absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.1] bg-black/45 px-2.5 py-1.5 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),inset_-1px_-1px_1px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150 sm:gap-2.5 sm:px-3.5 sm:py-2">
        {/* Glass sheen highlight along the top edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />

        {/* PREV BUTTON */}
        <button
          ref={prevRef}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/85 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.35),inset_-1px_-1px_1px_rgba(0,0,0,0.2)] outline-none transition-all duration-300 ease-out hover:scale-[1.04] hover:bg-[rgba(231,33,0,0.24)] hover:text-white active:scale-[0.97] sm:size-9"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* CATEGORY SWITCHERS */}
        <div className="flex gap-1">
          {(["interior", "exterior"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                setActiveIndex(0);
              }}
              className={[
                "rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ease-out active:scale-[0.97] sm:px-6 sm:text-xs",
                viewMode === mode
                  ? "bg-[rgba(231,33,0,0.28)] text-white shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.45),inset_-1px_-1px_1px_rgba(0,0,0,0.25),0_4px_18px_rgba(231,33,0,0.35)]"
                  : "bg-white/[0.08] text-white/85 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.35),inset_-1px_-1px_1px_rgba(0,0,0,0.2)] hover:bg-[rgba(231,33,0,0.24)] hover:text-white",
              ].join(" ")}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* NEXT BUTTON */}
        <button
          ref={nextRef}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/85 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.35),inset_-1px_-1px_1px_rgba(0,0,0,0.2)] outline-none transition-all duration-300 ease-out hover:scale-[1.04] hover:bg-[rgba(231,33,0,0.24)] hover:text-white active:scale-[0.97] sm:size-9"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
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
