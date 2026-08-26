import { useCallback, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
              className="flex h-full w-full items-center justify-center"
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
            </motion.div>
          )}
        </Document>
      </div>
    </motion.div>
  );
};

export default BrochureModal;
