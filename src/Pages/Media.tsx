import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, FileText, Images, PlayCircle, Ruler, X, type LucideIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import brochureImg from "../assets/Home/1.png";
import galleryImg from "../assets/amenities/popup/Restaurant.jpg";
import walkthroughImg from "../assets/AvailabilityPage/building.png";
import certificationsImg from "../assets/amenities/popup/Double Height Reception.jpg";
import technicalImg from "../assets/Home/Home page dark.png";

// Loaded from a CDN (matching the installed react-pdf's pdfjs build) so the
// worker doesn't need its own bundler wiring.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BROCHURE_PDF = "/media/brochure.pdf";

interface MediaPanel {
  title: string;
  subtitle?: string;
  image?: string;
  to?: string;
  onClick?: () => void;
  icon: LucideIcon;
}

const Media = () => {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const FlipBook = HTMLFlipBook as any;

  const PANELS: MediaPanel[] = [
    { title: "Brochure", subtitle: "Work. Play. Live. Better.", image: brochureImg, onClick: () => setIsBrochureOpen(true), icon: FileText },
    { title: "Gallery", image: galleryImg, to: "/media/gallery", icon: Images },
    { title: "Walk-through", image: walkthroughImg, onClick: () => setIsWalkthroughOpen(true), icon: PlayCircle },
    { title: "Certifications", image: certificationsImg, to: "/certifictions", icon: Award },
    { title: "Technical Specifications", image: technicalImg, to: "/technicalspecifictions", icon: Ruler },
  ];

  return (
  <div className="relative h-dvh w-full overflow-hidden bg-[#071322]">
    {/* Ambient glow lights, left and right */}
    <div
      aria-hidden
      className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-30 blur-[110px]"
      style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-30 blur-[110px]"
      style={{ background: "radial-gradient(circle, #e8321c 0%, transparent 70%)" }}
    />

    <div className="relative z-10 flex h-full w-full items-center justify-center px-4 pb-28 pt-24 sm:px-10">
      <div className="flex h-[66vh] max-h-[520px] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        {PANELS.map((panel) => {
          const Icon = panel.icon;
          const content = (
            <div className="relative flex h-full w-full flex-col items-center justify-start overflow-hidden pt-12 text-center sm:pt-14">
              {panel.image ? (
                <>
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[#071322] via-[#0a1c34] to-[#071322]" />
              )}

              {/* Icon badge */}
              <span className="relative mb-4 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/80 shadow-[inset_1px_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md transition-all duration-500 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/15 group-hover:text-[#D4AF37]">
                <Icon size={18} strokeWidth={1.5} />
              </span>

              <h3 className="relative whitespace-pre-line px-2 text-lg font-light uppercase tracking-[0.15em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] sm:text-2xl">
                {panel.title}
              </h3>

              {/* Gold accent underline, grows in on hover */}
              <span className="relative mt-3 h-px w-8 bg-[#D4AF37]/50 transition-all duration-500 group-hover:w-16 group-hover:bg-[#D4AF37]" />

              {panel.subtitle && (
                <p className="relative mt-auto mb-16 px-4 text-sm font-semibold text-white/70 sm:text-base">
                  {panel.subtitle}
                </p>
              )}
            </div>
          );

          const shared =
            "group relative flex-1 border-r border-white/10 transition-all duration-500 ease-out last:border-r-0 hover:flex-[1.15]";

          if (panel.to) {
            return (
              <Link key={panel.title} to={panel.to} className={`${shared} cursor-pointer`}>
                {content}
              </Link>
            );
          }

          if (panel.onClick) {
            return (
              <button
                key={panel.title}
                type="button"
                onClick={panel.onClick}
                className={`${shared} block cursor-pointer appearance-none bg-transparent p-0 m-0 text-left outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60`}
              >
                {content}
              </button>
            );
          }

          return (
            <div key={panel.title} className={shared}>
              {content}
            </div>
          );
        })}
      </div>
    </div>

    {isBrochureOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10">
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

    {isWalkthroughOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10">
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
