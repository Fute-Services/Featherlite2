import { useState, useMemo, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/effect-fade";
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
          className="flex items-center justify-center w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] lg:w-[42px] lg:h-[42px] rounded-full border border-white/10 bg-gradient-to-b from-slate-600/80 to-slate-900/90 shadow-[0_6px_14px_rgba(0,0,0,0.55),inset_1.5px_1.5px_1px_rgba(255,255,255,0.3),inset_-1.5px_-1.5px_1.5px_rgba(0,0,0,0.45)] backdrop-blur-md cursor-pointer transition-all duration-200 hover:scale-105 hover:from-slate-500/80 hover:to-slate-800/90 active:scale-95 active:shadow-[inset_1.5px_1.5px_2px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_rgba(255,255,255,0.15)]"
        >
          <FaAngleLeft className="w-4 h-4 text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </Link>
      </div>

      {/* TITLE */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-10 z-40 pointer-events-none rounded-2xl border border-white/[0.1] bg-black/45 px-5 py-3 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),inset_-1px_-1px_1px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150">
        <h2 className="text-white text-sm sm:text-base font-light tracking-[0.2em] uppercase whitespace-nowrap">
          {(filteredImages[activeIndex]?.title || "Loading...").replace(/['"]+$/, "")}
        </h2>
      </div>

      {/* SWIPER */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Swiper
          key={viewMode + filteredImages.length}
          effect={"fade"}
          centeredSlides={true}
          slidesPerView={1}
          loop={filteredImages.length > 2}
          speed={700}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          fadeEffect={{ crossFade: true }}
          onBeforeInit={(swiper) => {
            (swiper.params.navigation as any).prevEl = prevRef.current;
            (swiper.params.navigation as any).nextEl = nextRef.current;
          }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          modules={[EffectFade, Navigation]}
          className="w-full h-full"
        >
          {filteredImages.map((img: any, index: number) => (
            <SwiperSlide key={index} className="w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={img.url || img.image}
                  alt={img.title}
                  loading="eager"
                  decoding="async"
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
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/85 outline-none transition-all duration-300 ease-out hover:scale-[1.04] hover:bg-[rgba(231,33,0,0.24)] hover:text-white active:scale-[0.97] sm:size-9"
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
                  ? "bg-[rgba(231,33,0,0.28)] text-white shadow-[0_4px_18px_rgba(231,33,0,0.35)]"
                  : "bg-white/[0.08] text-white/85 hover:bg-[rgba(231,33,0,0.24)] hover:text-white",
              ].join(" ")}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* NEXT BUTTON */}
        <button
          ref={nextRef}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/85 outline-none transition-all duration-300 ease-out hover:scale-[1.04] hover:bg-[rgba(231,33,0,0.24)] hover:text-white active:scale-[0.97] sm:size-9"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                /* fade effect already drives each slide's opacity via its own inline
                   style - just promote images to their own GPU layer up-front so the
                   crossfade doesn't stall on first paint. */
                .swiper-slide img {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .swiper-button-disabled { opacity: 0.1 !important; pointer-events: none; }
            `,
        }}
      />
    </div>
  );
}
