import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play, RefreshCw, WifiOff, X } from "lucide-react";
import posterImg from "../../assets/Media/walkthrough_hero.jpg";

/**
 * The walk-through film.
 *
 * Two sources, in order of preference:
 *
 * 1. `public/media/walkthrough.mp4` - a bundled copy. This is the only source
 *    that plays on a tablet in airplane mode, which is what the app is for.
 * 2. the YouTube embed - the website's original source, and the fallback when
 *    no local copy has been dropped in.
 *
 * The old modal hard-coded (2) behind a spinner that nothing ever cleared, so
 * with no network - the app's normal state - the film "loaded" forever. Every
 * path here now ends in either a playing film or a message that says what is
 * wrong and what to do about it.
 */
const LOCAL_FILM = "/media/walkthrough.mp4";
const EMBED_SRC =
  "https://www.youtube.com/embed/CgHy7kYATNo?autoplay=1&rel=0&playsinline=1";
const WATCH_URL = "https://www.youtube.com/watch?v=CgHy7kYATNo";

/** How long the embed gets before we stop pretending it is still coming. */
const EMBED_TIMEOUT_MS = 9000;

type Source = "probing" | "local" | "embed";

/* Probed once per session, then remembered: opening the modal a second time
   must not re-ask for something that cannot change. */
let hasLocalFilm: boolean | null = null;
let inFlight: Promise<boolean> | null = null;

/**
 * Is the film packaged with this build? A HEAD is enough and costs nothing on
 * the local Capacitor server. A dev server can answer a missing public file
 * with the SPA index.html, so an HTML answer counts as "missing".
 */
export function probeWalkthroughFilm(): Promise<boolean> {
  if (hasLocalFilm !== null) return Promise.resolve(hasLocalFilm);
  inFlight ??= fetch(LOCAL_FILM, { method: "HEAD" })
    .then((res) => {
      const type = res.headers.get("content-type") ?? "";
      return res.ok && !type.includes("text/html");
    })
    .catch(() => false)
    .then((ok) => {
      hasLocalFilm = ok;
      inFlight = null;
      return ok;
    });
  return inFlight;
}

const WalkthroughModal = ({ onClose }: { onClose: () => void }) => {
  const [source, setSource] = useState<Source>(
    hasLocalFilm === null ? "probing" : hasLocalFilm ? "local" : "embed",
  );
  const [playing, setPlaying] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [offline, setOffline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine === false,
  );
  /* Bumping this remounts the player, which is how "try again" is done - an
     iframe will not reload just because it is handed the same src again. */
  const [attempt, setAttempt] = useState(0);
  /* A film has sound, and a browser will not autoplay sound without a gesture.
     That rejection used to leave a black rectangle whose controls only appear
     on hover - so track it and put a real play button on top instead. */
  const [needsTap, setNeedsTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (source !== "probing") return;
    let alive = true;
    void probeWalkthroughFilm().then((ok) => {
      if (alive) setSource(ok ? "local" : "embed");
    });
    return () => {
      alive = false;
    };
  }, [source]);

  /* The bundled film needs no spinner at all: it has the hero still as its
     poster and a play button on top from the first frame, so a slow decode
     looks like a paused film rather than a hang. */
  useEffect(() => {
    if (source !== "local") return;
    setPlaying(true);
    setNeedsTap(true);
  }, [source, attempt]);

  /* Esc closes, same as the close button. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* A tablet that regains Wi-Fi mid-modal should get the film, not a stale
     "no connection" card. */
  useEffect(() => {
    const backOnline = () => {
      setOffline(false);
      setStalled(false);
      setAttempt((n) => n + 1);
    };
    const wentOffline = () => setOffline(true);
    window.addEventListener("online", backOnline);
    window.addEventListener("offline", wentOffline);
    return () => {
      window.removeEventListener("online", backOnline);
      window.removeEventListener("offline", wentOffline);
    };
  }, []);

  /* The embed never reports failure - a blocked YouTube simply never fires
     load - so time it out instead of spinning forever. */
  useEffect(() => {
    if (source !== "embed" || playing || offline) return;
    const id = window.setTimeout(() => setStalled(true), EMBED_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [source, playing, offline, attempt]);

  const startFilm = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    void el
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => setNeedsTap(true));
  }, []);

  const retry = useCallback(() => {
    setStalled(false);
    setPlaying(false);
    setOffline(typeof navigator !== "undefined" && navigator.onLine === false);
    setAttempt((n) => n + 1);
  }, []);

  /* A local file that fails to decode is still better served by the embed than
     by a black rectangle. */
  const onVideoError = useCallback(() => {
    hasLocalFilm = false;
    setPlaying(false);
    setSource("embed");
  }, []);

  const showNotice = source === "embed" && (offline || stalled);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[1020] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label="Walk-through film"
    >
      <button
        onClick={onClose}
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
        {/* sits behind the player so the frame is never an empty black box */}
        {!playing && !showNotice && (
          <span className="absolute inset-0 z-0 flex items-center justify-center">
            <span className="size-9 animate-spin rounded-full border-2 border-white/15 border-t-[#C89D54]" />
          </span>
        )}

        {source === "local" && (
          <>
            <video
              ref={videoRef}
              key={`film-${attempt}`}
              src={LOCAL_FILM}
              /* the hero still, so the frame is the film's own artwork rather
                 than a black rectangle while the first frame decodes */
              poster={posterImg}
              className="relative z-10 h-full w-full flex-1 bg-black"
              controls
              playsInline
              preload="auto"
              controlsList="nodownload"
              disablePictureInPicture
              onLoadedMetadata={startFilm}
              onCanPlay={startFilm}
              onPlaying={() => setNeedsTap(false)}
              onPause={() => setNeedsTap(true)}
              onEnded={() => setNeedsTap(true)}
              onError={onVideoError}
            />
            {needsTap && (
              /* not full-bleed, and the scrim ignores pointers, so the seek bar
                 underneath stays reachable while the film is paused */
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/25">
                <button
                  type="button"
                  onClick={startFilm}
                  aria-label="Play the film"
                  className="pointer-events-auto flex size-16 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#C89D54] hover:bg-[#C89D54] hover:text-black"
                >
                  <Play size={24} className="ml-1" fill="currentColor" />
                </button>
              </div>
            )}
          </>
        )}

        {source === "embed" && !offline && (
          <iframe
            key={`embed-${attempt}`}
            src={EMBED_SRC}
            className={`relative z-10 h-full w-full flex-1 border-none ${
              showNotice ? "invisible" : ""
            }`}
            title="Walkthrough Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setPlaying(true)}
          />
        )}

        {showNotice && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black px-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-[#C89D54]/50 text-[#C89D54]">
              <WifiOff size={20} />
            </span>
            <div>
              <p className="font-serif text-2xl text-white">
                The film needs a connection
              </p>
              <p className="mt-1.5 max-w-md text-sm text-white/60">
                {offline
                  ? "This device is offline. Connect to Wi-Fi and try again - everything else in the app works without a network."
                  : "The video service is not responding. Check the connection and try again."}
              </p>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={retry}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#C89D54] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C89D54] transition-colors hover:bg-[#C89D54] hover:text-black"
              >
                <RefreshCw size={14} />
                Try again
              </button>
              <a
                href={WATCH_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white/60 hover:text-white"
              >
                <ExternalLink size={14} />
                Open in browser
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WalkthroughModal;
