import { useState, useMemo,
  //  useEffect
   } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
// import axios from "axios";
// import { FALLBACK_GALLERY, normalizeGallery, type GalleryCategory } from "./galleryFallback";
import Sidebar from "../../Components/Navbar/Sidebar";

import Gallery from '../../Data/Gallery.json'

import "swiper/css";
import "swiper/css/effect-fade";

interface GalleryImage {
  image: string;
  title: string;
  _id: string;
}

interface GalleryCategory {
  _id: string;
  category: string;
  images: GalleryImage[];
}

// const GALLERY_API = "https://featherlitebackend.onrender.com/api/gallery";

export default function GalleryPage() {
  // const [activeIndex, setActiveIndex] = useState(0);
  // const [viewMode, setViewMode] = useState("exterior");
  // const [allImages, setAllImages] = useState<GalleryCategory[]>([]);
  // const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  // const [swiperInstance, setSwiperInstance] = useState<any>(null);

  // const handleImageSelect = (index: number) => {
  //   setActiveIndex(index);
  //   if (swiperInstance) {
  //     swiperInstance.slideToLoop(index);
  //   }
  // };

  // useEffect(() => {
  //   const controller = new AbortController();

  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(GALLERY_API, {
  //         timeout: 8000,
  //         signal: controller.signal,
  //       });
  //       const normalized = normalizeGallery(res.data);
  //       // An API that answers with nothing useful is no better than one that is
  //       // down - fall back either way so the page is never blank.
  //       setAllImages(normalized.length > 0 ? normalized : FALLBACK_GALLERY);
  //       setLoadState("ready");
  //     } catch (err) {
  //       if (axios.isCancel(err)) return;
  //       console.warn("Gallery API unavailable, using bundled images.", err);
  //       setAllImages(FALLBACK_GALLERY);
  //       setLoadState("ready");
  //     }
  //   };
  //   fetchData();

  //   return () => controller.abort();
  // }, []);

  // const filteredImages = useMemo(() => {
  //   return allImages.find((group) => group.category === viewMode)?.images || [];
  // }, [allImages, viewMode]);

  // const showEmptyState = loadState !== "loading" && filteredImages.length === 0;

    const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState("exterior");

  // Use local Gallery.json data directly
  const [allImages] = useState<GalleryCategory[]>(
    Gallery as GalleryCategory[]
  );

  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const handleImageSelect = (index: number) => {
    setActiveIndex(index);

    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    return (
      allImages.find((group) => group.category === viewMode)?.images || []
    );
  }, [allImages, viewMode]);

  // Empty state
  const showEmptyState = filteredImages.length === 0;


  return (
    <div className="w-screen p-[10%] h-screen overflow-hidden relative bg-black font-sans">
      {/* SIDEBAR FOR CATEGORY TOGGLE (Interior / Exterior) */}
      <Sidebar
        isGalleryPage={true}
        galleryMode={viewMode as "interior" | "exterior"}
        onGalleryModeChange={(mode) => {
          setViewMode(mode);
          setActiveIndex(0);
          if (swiperInstance) {
            swiperInstance.slideToLoop(0);
          }
        }}
        galleryImages={filteredImages}
        activeImageIndex={activeIndex}
        onImageSelect={handleImageSelect}
      />

      {/* SWIPER */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Swiper
          key={viewMode + filteredImages.length}
          effect={"fade"}
          centeredSlides={true}
          slidesPerView={1}
          loop={filteredImages.length > 2}
          speed={700}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          fadeEffect={{ crossFade: true }}
          modules={[EffectFade]}
          className="w-full h-full"
        >
          {filteredImages.map((img: any, index: number) => (
            <SwiperSlide key={index} className="w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={img.url || img.image}
                  alt={img.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showEmptyState && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-white/80 text-sm sm:text-base font-light tracking-wide">
            {`No ${viewMode} images yet.`}
          </p>
        </div>
      )}

      {/* (Bottom navigation controls removed per user request) */}

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