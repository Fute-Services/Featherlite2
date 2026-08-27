import { useCallback, useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

/**
 * Keeps a decorative clip playing without ever handing the user the browser's
 * own play button.
 *
 * Android WebView will happily autoplay a muted video, but if the very first
 * play() attempt is rejected (a cold WebView, a still-buffering src, a
 * backgrounded tab) it paints its big circular overlay play button and leaves
 * it there. So: force `muted` as a *property* (the React attribute alone is
 * unreliable), retry play() on every readiness event, and fall back to the
 * next tap anywhere on screen.
 */
export function useAutoplay(ref: React.RefObject<HTMLVideoElement | null>, src?: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.controls = false;

    const tryPlay = () => {
      if (!el.paused) return;
      void el.play().catch(() => {
        /* blocked - the gesture listener below picks it up */
      });
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("pause", tryPlay);

    // last resort: the first touch/click anywhere counts as the user gesture
    const onGesture = () => tryPlay();
    document.addEventListener("pointerdown", onGesture, true);
    document.addEventListener("touchstart", onGesture, true);

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("pause", tryPlay);
      document.removeEventListener("pointerdown", onGesture, true);
      document.removeEventListener("touchstart", onGesture, true);
    };
  }, [ref, src]);
}

/** Warms a clip into the HTTP cache so opening it later is instant. */
const prefetched = new Set<string>();
export function prefetchVideo(src?: string) {
  if (!src || prefetched.has(src)) return;
  prefetched.add(src);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "video";
  link.href = src;
  document.head.appendChild(link);
}

type AutoVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "controls"> & {
  src: string;
  /** class applied once the first frame is decoded, for a flash-free fade-in */
  fadeIn?: boolean;
};

/**
 * A <video> that starts itself, shows no controls, and only becomes visible
 * once it has a real frame to show (so you never get a black rectangle
 * flashing in before the clip starts).
 */
const AutoVideo = ({ src, className = "", fadeIn = true, onLoadedData, ...rest }: AutoVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useAutoplay(ref, src);

  useEffect(() => setReady(false), [src]);

  const handleLoadedData = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setReady(true);
      onLoadedData?.(e);
    },
    [onLoadedData],
  );

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      // @ts-expect-error non-standard but respected by Chromium
      disableRemotePlayback=""
      onLoadedData={handleLoadedData}
      className={[
        className,
        fadeIn ? "transition-opacity duration-500 ease-out" : "",
        fadeIn && !ready ? "opacity-0" : "opacity-100",
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
};

export default AutoVideo;
