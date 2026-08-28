import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Play, RefreshCw, WifiOff } from "lucide-react";
/* the same hero still the Media card uses - this module is compiled from
   inside web/src, so the relative path lands on the website assets */
import posterImg from "../assets/Media/walkthrough_hero.jpg";

/**
 * The walk-through player, for the app only.
 *
 * The website plays the film from a YouTube embed, which is fine for a browser
 * and useless on a tablet in airplane mode: the iframe never fires load, so the
 * spinner behind it span for good and "Watch full film" looked broken.
 *
 * This replaces just that iframe during the app build (see
 * `scripts/app-ui-plugin.mjs`). `web/` is not edited, so the website keeps the
 * embed exactly as it is.
 *
 * Two sources, in order of preference:
 *
 * 1. `public/media/walkthrough.mp4` - a bundled copy, the only source that
 *    plays with no network. Drop the film in and this picks it up; there is
 *    nothing else to switch on.
 * 2. the YouTube embed - for a tablet that does have Wi-Fi.
 *
 * Whatever happens, the frame ends up showing either a film or a message that
 * says what is wrong. It never just spins.
 */
const LOCAL_FILM = "/media/walkthrough.mp4";
const EMBED_SRC =
  "https://www.youtube.com/embed/CgHy7kYATNo?autoplay=1&rel=0&playsinline=1";
const WATCH_URL = "https://www.youtube.com/watch?v=CgHy7kYATNo";

/** How long the embed gets before we stop pretending it is still coming. */
const EMBED_TIMEOUT_MS = 9000;
/** How long the "can we actually reach YouTube?" probe gets. */
const REACH_TIMEOUT_MS = 3500;

type Source = "probing" | "local" | "embed";

/* Probed once per session, then remembered: opening the modal a second time
   must not re-ask for something that cannot change. */
let hasLocalFilm: boolean | null = null;
let inFlight: Promise<boolean> | null = null;

/**
 * Is the film packaged with this build? A HEAD costs nothing on the Capacitor
 * local server. That server answers a missing file by serving index.html, so
 * an HTML answer counts as "missing".
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

/**
 * Can the device reach YouTube right now?
 *
 * `navigator.onLine` is not usable here: Android WebView answers `true`
 * unconditionally unless the app holds ACCESS_NETWORK_STATE, which this one
 * does not. So ask the network instead. `no-cors` means we never see the
 * response body - we only care whether the request completed at all.
 */
function canReachEmbed(): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REACH_TIMEOUT_MS);
  return fetch("https://www.youtube.com/generate_204", {
    mode: "no-cors",
    cache: "no-store",
    signal: ctrl.signal,
  })
    .then(() => true)
    .catch(() => false)
    .finally(() => clearTimeout(timer));
}

const WalkthroughPlayer = () => {
  const [source, setSource] = useState<Source>(
    hasLocalFilm === null ? "probing" : hasLocalFilm ? "local" : "embed",
  );
  const [playing, setPlaying] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [offline, setOffline] = useState(false);
  /* Bumping this remounts the player, which is how "try again" is done - an
     iframe will not reload just because it is handed the same src again. */
  const [attempt, setAttempt] = useState(0);
  /* A film has sound, and a WebView will not autoplay sound without a gesture.
     That rejection used to leave a black rectangle whose controls only appear
     on a tap - so track it and put a real play button on top instead. */
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

  /* A tablet that regains Wi-Fi mid-modal should get the film, not a stale
     "no connection" card. */
  useEffect(() => {
    const backOnline = () => {
      setOffline(false);
      setStalled(false);
      setAttempt((n) => n + 1);
    };
    window.addEventListener("online", backOnline);
    return () => window.removeEventListener("online", backOnline);
  }, []);

  /* The embed never reports failure - a blocked YouTube simply never fires
     load - so time it out instead of spinning forever. The reachability probe
     usually beats the timeout by several seconds on a tablet with no network,
     which is the case that matters here. */
  useEffect(() => {
    if (source !== "embed" || playing || offline) return;
    let alive = true;
    void canReachEmbed().then((reachable) => {
      if (alive && !reachable) setOffline(true);
    });
    const id = window.setTimeout(() => {
      if (alive) setStalled(true);
    }, EMBED_TIMEOUT_MS);
    return () => {
      alive = false;
      window.clearTimeout(id);
    };
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
    setOffline(false);
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
    <>
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
    </>
  );
};

export default WalkthroughPlayer;
