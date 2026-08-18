import { Link } from "react-router-dom";
import { Award, FileText, Images, PlayCircle, Ruler, type LucideIcon } from "lucide-react";
import galleryImg from "../assets/amenities/popup/Restaurant.jpg";
import walkthroughImg from "../assets/AvailabilityPage/building.png";
import technicalImg from "../assets/Home/Home page dark.png";

interface MediaPanel {
  title: string;
  subtitle?: string;
  image?: string;
  to?: string;
  icon: LucideIcon;
}

const PANELS: MediaPanel[] = [
  { title: "Brochure", subtitle: "Work. Play. Live. Better.", icon: FileText },
  { title: "Gallery", image: galleryImg, to: "/media/gallery", icon: Images },
  { title: "Walk-through", image: walkthroughImg, to: "/vr-tour", icon: PlayCircle },
  { title: "Certifications", icon: Award },
  { title: "Technical Specifications", image: technicalImg, icon: Ruler },
];

const Media = () => (
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
      <div className="flex h-[58vh] max-h-[440px] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        {PANELS.map((panel, index) => {
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

              {/* Index number, editorial touch */}
              <span className="absolute left-4 top-4 font-display text-xs tracking-[0.2em] text-white/30">
                0{index + 1}
              </span>

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
