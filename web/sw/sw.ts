/// <reference lib="webworker" />
// Featherlite Signature service worker (injectManifest).
// - App shell (html/js/css/fonts) is precached -> app opens with no network.
// - Big media (renders, panoramas, videos, brochure PDF) is cached on first use,
//   or all at once via the in-app "Download for offline" button (see offlineCache.ts).
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { RangeRequestsPlugin } from 'workbox-range-requests'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<unknown> }

// must match MEDIA_CACHE in src/lib/offlineCache.ts
const MEDIA_CACHE = 'fl-media-v1'

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST as never)

// SPA: any page navigation falls back to the cached index.html
// (except the mirrored Location tour, which is its own static page shown in an iframe)
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), { denylist: [/^\/location-tour\//] }),
)

// Remote image CDNs send CORS headers; re-request them in cors mode so the cached
// copy is a real (non-opaque) response, which costs far less storage quota.
const corsPlugin = {
  requestWillFetch: async ({ request }: { request: Request }) =>
    new Request(request.url, { mode: 'cors', credentials: 'omit' }),
}

const isMedia = (url: URL, req: Request) =>
  req.destination === 'image' ||
  req.destination === 'video' ||
  req.destination === 'audio' ||
  /\.(?:png|jpe?g|webp|avif|gif|svg|mp4|webm|pdf|mjs|xml)$/i.test(url.pathname)

// Same-origin media (videos, brochure PDF, renders): the request goes out untouched so
// the browser's Range header survives (a video needs a 206 answer to its Range request).
registerRoute(
  ({ url, request }) => url.origin === self.location.origin && isMedia(url, request),
  new CacheFirst({
    cacheName: MEDIA_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new RangeRequestsPlugin(), // answers Range requests from the cached full file
    ],
  }),
)

// Remote image CDNs (no Range needed)
registerRoute(
  ({ url }) => url.hostname === 'res.cloudinary.com' || url.hostname === 'imagedelivery.net',
  new CacheFirst({
    cacheName: MEDIA_CACHE,
    plugins: [new CacheableResponsePlugin({ statuses: [200] }), corsPlugin],
  }),
)

// Google Fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({ cacheName: 'fl-fonts-css', plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })] }),
)
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({ cacheName: 'fl-fonts', plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })] }),
)
