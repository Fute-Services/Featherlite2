import { useEffect, useRef } from "react";
import Hls from "hls.js";

// The walkthrough stored in the app: an HLS playlist of short fMP4 pieces
// (public/media/walk-hls/). Every request is small, so it passes cleanly through the
// service worker's cache - one 150 MB stream did not (it stalled after a few seconds).
export const WALKTHROUGH_PLAYLIST = "/media/walk-hls/index.m3u8";

export default function WalkthroughPlayer({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60, backBufferLength: 20 });
      let netRetries = 0;
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && netRetries++ < 5) hls.startLoad();
        else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
        else hls.destroy();
      });
      hls.loadSource(WALKTHROUGH_PLAYLIST);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    // browsers with built-in HLS (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = WALKTHROUGH_PLAYLIST;
      void video.play().catch(() => {});
    }
  }, []);

  return <video ref={ref} className={className} controls playsInline preload="auto" />;
}
