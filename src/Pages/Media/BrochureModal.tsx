import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { X } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BROCHURE_PDF = "/media/brochure.pdf";

interface BrochureModalProps {
  onClose: () => void;
}

const BrochureModal = ({ onClose }: BrochureModalProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const FlipBook = HTMLFlipBook as any;

  return (
    <div className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10">
      <div className="relative flex h-full max-h-[85vh] w-full max-w-5xl flex-col items-center justify-center">
        <button
          onClick={onClose}
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
  );
};

export default BrochureModal;
