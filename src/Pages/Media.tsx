import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import galleryImg from "../assets/amenities/popup/Restaurant.jpg";
import walkthroughImg from "../assets/AvailabilityPage/building.png";
import technicalImg from "../assets/Home/Home page dark.png";

interface MediaPanel {
  title: string;
  subtitle?: string;
  image?: string;
  to?: string;
}

const PANELS: MediaPanel[] = [
  { title: "Brochure", subtitle: "Work. Play. Live. Better." },
  { title: "Gallery", image: galleryImg, to: "/media/gallery" },
  { title: "Walk-through", image: walkthroughImg, to: "/vr-tour" },
  { title: "Certifications" },
  { title: "Technical Specifications", image: technicalImg },
];

const Media = () => (
  <div className="relative h-dvh w-full overflow-hidden bg-[#071322]">
    {/* Diagonal line texture, top-left corner */}
    <div
      className="pointer-events-none absolute -left-10 -top-10 h-[420px] w-[420px] opacity-40"
      style={{
        backgroundImage:
          "repeating-linear-gradient(65deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 2px, transparent 2px, transparent 34px)",
        maskImage: "radial-gradient(circle at 0% 0%, black 55%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(circle at 0% 0%, black 55%, transparent 80%)",
      }}
    />

    <div className="relative z-10 flex h-full w-full items-center justify-center px-4 pb-28 pt-24 sm:px-10">
      <div className="flex h-[70vh] max-h-[560px] w-full max-w-6xl overflow-hidden rounded-sm">
        {PANELS.map((panel) => {
          const content = (
            <div className="relative flex h-full w-full flex-col items-center justify-start overflow-hidden pt-14 text-center">
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

              {panel.title === "Certifications" && (
                <Award className="absolute inset-0 m-auto h-16 w-16 text-white/15" />
              )}

              <h3 className="relative whitespace-pre-line px-2 text-lg font-light uppercase tracking-[0.15em] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] sm:text-2xl">
                {panel.title}
              </h3>

              {panel.subtitle && (
                <p className="relative mt-auto mb-16 px-4 text-sm font-semibold text-white/70 sm:text-base">
                  {panel.subtitle}
                </p>
              )}
            </div>
          );

          const shared =
            "group relative flex-1 border-r border-white/10 transition-all duration-500 ease-out last:border-r-0 hover:flex-[1.15]";

          return panel.to ? (
            <Link key={panel.title} to={panel.to} className={`${shared} cursor-pointer`}>
              {content}
            </Link>
          ) : (
            <div key={panel.title} className={shared}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default Media;
