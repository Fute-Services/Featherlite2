import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Award, FileText, Images, Play, Ruler, X, type LucideIcon } from "lucide-react";
const CF_MEDIA = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media";
const brochureImg = `${CF_MEDIA}/brochure-cover-navy/orig`;
const galleryImg = `${CF_MEDIA}/gallery-cover-2026/orig`;
const certificationsImg = `${CF_MEDIA}/certifications-cover-2026/orig`;
const technicalImg = `${CF_MEDIA}/technical-cover/orig`;
const walkthroughImg = `${CF_MEDIA}/walkthrough-hero/orig`;

const BrochureModal = lazy(() => import("./Media/BrochureModal"));

interface MediaCard {
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
  to?: string;
  onClick?: () => void;
  icon: LucideIcon;
}

const Media = () => {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  // Warm the brochure while the page sits idle: its JS chunk (pdf.js + the
  // flipbook) and the PDF itself are the two things that used to make the
  // card feel like it hangs on the first tap.
  useEffect(() => {
    const warm = () => {
      void import("./Media/BrochureModal");
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "fetch";
      link.href = "/media/brochure.pdf";
      document.head.appendChild(link);
    };
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    if (ric) {
      const id = ric(warm, { timeout: 2500 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(warm, 1200);
    return () => window.clearTimeout(id);
  }, []);

  const CARDS: MediaCard[] = [
    { title: "BROCHURE", description: "Download our detailed project brochure.", image: brochureImg, onClick: () => setIsBrochureOpen(true), icon: FileText },
    { title: "GALLERY", description: "A collection of images that capture the essence.", image: galleryImg, to: "/media/gallery", icon: Images },
    { title: "CERTIFICATIONS", description: "Our commitment to quality and excellence.", image: certificationsImg, imagePosition: "object-top", to: "/certifications", icon: Award },
    { title: "TECHNICAL SPECIFICATIONS", description: "Technical details and specifications at a glance.", image: technicalImg, imagePosition: "object-top", to: "/technical-specifications", icon: Ruler },
  ];

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0D2D43] px-5 pb-8 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pb-10">
      {/* Background Glow Lights */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-10 blur-[140px]"
        style={{ background: "radial-gradient(circle, #C89D54 0%, transparent 70%)" }}
      />

      {/* Decorative top-left gold line art graphic */}
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-48 w-48 opacity-30">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full stroke-[#C89D54]">
          <line x1="-20" y1="20" x2="180" y2="-80" strokeWidth="0.8" />
          <line x1="-20" y1="40" x2="180" y2="-60" strokeWidth="0.8" />
          <line x1="-20" y1="60" x2="180" y2="-40" strokeWidth="0.8" />
          <line x1="-20" y1="80" x2="180" y2="-20" strokeWidth="0.8" />
          <line x1="-20" y1="100" x2="180" y2="0" strokeWidth="0.8" />
          <line x1="-20" y1="120" x2="180" y2="20" strokeWidth="0.8" />
          <line x1="-20" y1="140" x2="180" y2="40" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Hero & Title section */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1700px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:w-[320px] lg:shrink-0"
        >
          <h1 className="text-4xl font-medium tracking-wide text-[#C89D54] sm:text-5xl">
            MEDIA
          </h1>
          <p className="mt-1.5 text-base font-normal text-white/90">
            Explore the Signature experience
          </p>
          <span className="mt-3 block h-[2px] w-12 bg-[#C89D54]" />
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/60">
            A curated collection of everything that brings Featherlite Signature to life.
          </p>
        </motion.div>

        {/* Right: Featured Walk-through video banner - stretched horizontally */}
        <motion.button
          initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          type="button"
          onClick={() => setIsWalkthroughOpen(true)}
          className="group relative block h-[210px] w-full flex-1 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#071526]/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl p-0 text-left transition-all duration-300 hover:border-[#C89D54]/50 sm:h-[230px] lg:h-[250px] lg:max-w-none"
        >
          <img
            src={walkthroughImg}
            alt="Experience Signature Walk-through"
            decoding="async"
            className="absolute inset-0 h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0D2D43]/90 via-[#0D2D43]/60 to-transparent" />

          <div className="relative flex h-full flex-col justify-center px-8 sm:px-12 lg:px-14">
            <span className="mb-3 flex size-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#C89D54] group-hover:bg-[#C89D54] group-hover:text-black">
              <Play size={16} className="ml-0.5" fill="currentColor" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C89D54]">
              WALK-THROUGH
            </p>
            <h2 className="mt-0.5 text-3xl font-medium text-white sm:text-4xl">
              Experience Signature
            </h2>
            <p className="mt-1.5 max-w-lg text-xs text-white/80 sm:text-sm">
              Step inside and explore every detail like never before.
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C89D54] group-hover:underline">
              WATCH FULL FILM
              <ArrowRight size={14} />
            </span>
          </div>
        </motion.button>
      </div>

      {/* 4 Bottom Cards Grid */}
      <div className="relative z-10 mx-auto mt-8 grid w-full max-w-[1700px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, idx) => {
          const Icon = card.icon;
          const content = (
            <div className="flex h-full flex-col justify-between">
              <div>
                {/* rounded to match the card: a backdrop-filter parent does not
                    clip its children to its own corner radius, so the photo has
                    to round itself or it squares off the card's top corners */}
                <div className="relative h-[140px] w-full overflow-hidden rounded-t-xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${card.imagePosition ?? ""}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081729]/30 via-transparent to-black/30" />
                </div>

                <span className="absolute left-4 top-[140px] flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#C89D54]/60 bg-[#071424]/80 text-[#C89D54] backdrop-blur-md shadow-md">
                  <Icon size={15} strokeWidth={1.5} />
                </span>

                <div className="px-4 pb-4 pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C89D54] line-clamp-1">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/70 line-clamp-2">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          );

          const cardStyles =
            "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#081729]/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl transition-all duration-300 hover:border-[#C89D54]/50 hover:bg-[#081729]/50 hover:-translate-y-1";

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: idx * 0.12 }}
              className="h-full"
            >
              {card.to ? (
                <Link to={card.to} className={cardStyles}>
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={card.onClick}
                  className={`${cardStyles} block w-full cursor-pointer text-left outline-none`}
                >
                  {content}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* PDF Brochure Modal */}
      <AnimatePresence>
        {isBrochureOpen && (
          <Suspense fallback={null}>
            <BrochureModal onClose={() => setIsBrochureOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Video Walkthrough Modal */}
      <AnimatePresence>
        {isWalkthroughOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
          >
            <button
              onClick={() => setIsWalkthroughOpen(false)}
              aria-label="Close walkthrough"
              className="absolute top-4 right-4 z-20 rounded bg-[#FF0000] p-2 text-white shadow-lg transition-colors hover:bg-red-700 md:top-8 md:right-8"
            >
              <X className="size-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex aspect-video w-full max-w-[1200px] flex-col overflow-hidden rounded-lg bg-black shadow-2xl"
            >
              {/* sits behind the iframe so the frame is never an empty black box */}
              <span className="absolute inset-0 z-0 flex items-center justify-center">
                <span className="size-9 animate-spin rounded-full border-2 border-white/15 border-t-[#C89D54]" />
              </span>
              <iframe
                src="https://www.youtube.com/embed/CgHy7kYATNo?autoplay=1&rel=0&playsinline=1"
                className="relative z-10 h-full w-full flex-1 border-none"
                title="Walkthrough Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Media;
