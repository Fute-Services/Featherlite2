import { useCallback, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// the worker ships with react-pdf's own pdfjs-dist, so it is bundled and cached
// offline instead of being fetched from unpkg on every open
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export const BROCHURE_PDF = "/media/brochure.pdf";

/** Pages rendered on each side of the open spread; the rest stay blank until
 *  you flip near them. Rendering all 57 pages of a 22 MB file up front is what
 *  made the brochure take seconds to appear. */
const RENDER_WINDOW = 6;

interface BrochureModalProps {
  onClose: () => void;
}

const BrochureModal = ({ onClose }: BrochureModalProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const FlipBook = HTMLFlipBook as any;
  const bookRef = useRef<any>(null);

  // zoom: 1x-3x. While zoomed, a transparent layer above the book pans it by
  // dragging (and pauses page-turn dragging); the side arrows still turn pages.
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  const clampPan = (x: number, y: number, z: number) => {
    const w = stageRef.current?.clientWidth ?? 0;
    const h = stageRef.current?.clientHeight ?? 0;
    const maxX = ((z - 1) * w) / 2;
    const maxY = ((z - 1) * h) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  };

  const changeZoom = (next: number) => {
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    setZoom(z);
    setPan((p) => (z === 1 ? { x: 0, y: 0 } : clampPan(p.x, p.y, z)));
  };

  // a new object identity here would make react-pdf re-download the file
  const fileOptions = useMemo(
    () => ({ disableAutoFetch: false, disableStream: false }),
    [],
  );

  const handleProgress = useCallback(({ loaded, total }: { loaded: number; total: number }) => {
    if (total > 0) setProgress(Math.min(100, Math.round((loaded / total) * 100)));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
    >
      <div className="relative flex h-full max-h-[85vh] w-full max-w-5xl flex-col items-center justify-center">
        <button
          onClick={onClose}
          aria-label="Close brochure"
          className="absolute -top-14 right-0 z-20 rounded bg-[#FF0000] p-2 text-white shadow-lg transition-colors hover:bg-red-700 md:-top-5 md:-right-5"
        >
          <X className="size-6" />
        </button>

        {/* Loader - shown the instant the modal opens, so the click always
            feels immediate even while the file is still streaming in */}
        <AnimatePresence>
          {!numPages && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5"
            >
              <span className="size-10 animate-spin rounded-full border-2 border-white/15 border-t-[#C89D54]" />
              <div className="h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
                <motion.span
                  className="block h-full rounded-full bg-[#C89D54]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(progress, 6)}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                Loading brochure {progress > 0 ? `${progress}%` : ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

          {numPages && (
          <>
          <button
            onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
            aria-label="Previous page"
            className="absolute left-0 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#C89D54] hover:text-[#C89D54] md:-left-6 cursor-pointer"
          >
            <FaAngleLeft className="size-5" />
          </button>
          <button
            onClick={() => bookRef.current?.pageFlip()?.flipNext()}
            aria-label="Next page"
            className="absolute right-0 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#C89D54] hover:text-[#C89D54] md:-right-6 cursor-pointer"
          >
            <FaAngleRight className="size-5" />
          </button>
          <div className="absolute -bottom-14 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/60 px-2 py-1.5 shadow-2xl backdrop-blur-xl md:-bottom-12">
            <button
              onClick={() => changeZoom(zoom - 0.5)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="flex size-10 items-center justify-center rounded-full text-white transition-all hover:text-[#C89D54] disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              <ZoomOut className="size-5" />
            </button>
            <button
              onClick={() => changeZoom(1)}
              aria-label="Reset zoom"
              className="min-w-12 text-center text-xs font-semibold tracking-wider text-white/80 hover:text-[#C89D54] cursor-pointer"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => changeZoom(zoom + 0.5)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="flex size-10 items-center justify-center rounded-full text-white transition-all hover:text-[#C89D54] disabled:opacity-30 cursor-pointer disabled:cursor-default"
            >
              <ZoomIn className="size-5" />
            </button>
          </div>
          </>
          )}

        <Document
          file={BROCHURE_PDF}
          options={fileOptions}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadProgress={handleProgress}
          loading={null}
          error={
            <p className="text-sm text-white/70">Brochure could not be loaded.</p>
          }
          className="flex h-full w-full items-center justify-center"
        >
          {numPages && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              ref={stageRef}
              className="relative flex h-full w-full items-center justify-center overflow-hidden"
            >
              <div
                className="flex h-full w-full items-center justify-center"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: dragging ? "none" : "transform 200ms ease-out",
                }}
              >
              <FlipBook
                ref={bookRef}
                width={450}
                height={420}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                showCover={true}
                maxShadowOpacity={0.4}
                flippingTime={700}
                useMouseEvents
                onFlip={(e: { data: number }) => setCurrentPage(e.data)}
                className="shadow-2xl"
              >
                {Array.from(new Array(numPages), (_, index) => {
                  const isNear = Math.abs(index - currentPage) <= RENDER_WINDOW;
                  return (
                    <div
                      key={`page_${index + 1}`}
                      className="flex h-full w-full items-center justify-center overflow-hidden bg-white"
                    >
                      {isNear && (
                        <Page
                          pageNumber={index + 1}
                          width={684}
                          scale={0.75}
                          devicePixelRatio={(window.devicePixelRatio || 1) * zoom}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          loading={null}
                          className="flex items-center justify-center"
                        />
                      )}
                    </div>
                  );
                })}
              </FlipBook>
              </div>
              {zoom > 1 && (
                <div
                  className={`absolute inset-0 z-10 touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                  onPointerDown={(e) => {
                    setDragging(true);
                    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (!dragging) return;
                    setPan(
                      clampPan(
                        dragStart.current.px + e.clientX - dragStart.current.x,
                        dragStart.current.py + e.clientY - dragStart.current.y,
                        zoom,
                      ),
                    );
                  }}
                  onPointerUp={() => setDragging(false)}
                  onPointerCancel={() => setDragging(false)}
                />
              )}
            </motion.div>
          )}
        </Document>
      </div>
    </motion.div>
  );
};

export default BrochureModal;
