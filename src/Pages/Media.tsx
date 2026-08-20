import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award, FileText, Images, Play, Ruler, X, type LucideIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

const brochureImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/brochure-cover/public";
const galleryImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/gallery-cover/public";
const certificationsImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/certifications-cover/public";
const technicalImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/media/tech-specs-cover/public";
const walkthroughImg = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/home/signature-sunset/public";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BROCHURE_PDF = "/media/brochure.pdf";

interface MediaCard {
  title: string;
  description: string;
  image: string;
  to?: string;
  onClick?: () => void;
  icon: LucideIcon;
}

const Media = () => {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const FlipBook = HTMLFlipBook as any;

  const CARDS: MediaCard[] = [
    { title: "BROCHURE", description: "Download our detailed project brochure.", image: brochureImg, onClick: () => setIsBrochureOpen(true), icon: FileText },
    { title: "GALLERY", description: "A collection of images that capture the essence.", image: galleryImg, to: "/media/gallery", icon: Images },
    { title: "CERTIFICATIONS", description: "Our commitment to quality and excellence.", image: certificationsImg, to: "/certifications", icon: Award },
    { title: "TECHNICAL SPECIFICATIONS", description: "Technical details and specifications at a glance.", image: technicalImg, to: "/technical-specifications", icon: Ruler },
  ];

  return (
    <div className="relative min-h-dvh w-full overflow-y-auto bg-[#040C18] px-5 pb-36 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pb-40">
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
          <h1 className="font-serif text-4xl font-normal tracking-wide text-[#C89D54] sm:text-5xl">
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
          className="group relative block h-[210px] w-full flex-1 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#071526] p-0 text-left shadow-2xl transition-all duration-300 hover:border-[#C89D54]/50 sm:h-[230px] lg:h-[250px] lg:max-w-none"
        >
          <img
            src={walkthroughImg}
            alt="Experience Signature Walk-through"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040C18]/90 via-[#040C18]/60 to-transparent" />

          <div className="relative flex h-full flex-col justify-center px-8 sm:px-12 lg:px-14">
            <span className="mb-3 flex size-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-[#C89D54] group-hover:bg-[#C89D54] group-hover:text-black">
              <Play size={16} className="ml-0.5" fill="currentColor" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C89D54]">
              WALK-THROUGH
            </p>
            <h2 className="mt-0.5 font-serif text-3xl text-white sm:text-4xl">
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
                <div className="relative h-[110px] w-full overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081729] via-transparent to-black/30" />
                </div>

                <span className="absolute left-4 top-[110px] flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#C89D54]/60 bg-[#071424] text-[#C89D54] shadow-md">
                  <Icon size={15} strokeWidth={1.5} />
                </span>

                <div className="px-4 pb-2 pt-6">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C89D54]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/70">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-3 pt-1">
                <ArrowRight size={15} className="text-[#C89D54] transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </div>
          );

          const cardStyles =
            "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#081729] shadow-lg transition-all duration-300 hover:border-[#C89D54]/50 hover:-translate-y-1";

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: idx * 0.12 }}
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
      {isBrochureOpen && (
        <div className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10">
          <div className="relative flex h-full max-h-[85vh] w-full max-w-5xl flex-col items-center justify-center">
            <button
              onClick={() => setIsBrochureOpen(false)}
              aria-label="Close brochure"
              className="absolute -top-14 right-0 z-20 rounded bg-[#FF0000] p-2 text-white shadow-lg transition-colors hover:bg-red-700 md:-top-5 md:-right-5"
            >
              <X className="size-6" />
            </button>

            <Document
              file={BROCHURE_PDF}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="flex h-full w-full items-center justify-center"
            >
              {numPages && (
                <FlipBook
                  width={450}
                  height={420}
                  size="stretch"
                  minWidth={315}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1533}
                  showCover={true}
                  className="shadow-2xl"
                >
                  {Array.from(new Array(numPages), (_, index) => (
                    <div
                      key={`page_${index + 1}`}
                      className="flex h-full w-full items-center justify-center overflow-hidden bg-white"
                    >
                      <Page
                        pageNumber={index + 1}
                        width={684}
                        scale={0.75}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        className="flex items-center justify-center"
                      />
                    </div>
                  ))}
                </FlipBook>
              )}
            </Document>
          </div>
        </div>
      )}

      {/* Video Walkthrough Modal */}
      {isWalkthroughOpen && (
        <div className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10">
          <button
            onClick={() => setIsWalkthroughOpen(false)}
            aria-label="Close walkthrough"
            className="absolute top-4 right-4 z-20 rounded bg-[#FF0000] p-2 text-white shadow-lg transition-colors hover:bg-red-700 md:top-8 md:right-8"
          >
            <X className="size-6" />
          </button>

          <div className="relative flex aspect-video w-full max-w-[1200px] flex-col overflow-hidden rounded-lg bg-black shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/CgHy7kYATNo?autoplay=1"
              className="h-full w-full flex-1 border-none"
              title="Walkthrough Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
