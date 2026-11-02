// Pre-downloads every heavy asset (renders, panoramas, videos, brochure PDF, CDN
// images) into the same cache the service worker serves from, so the whole app
// works with no internet. Driven by dist/offline-manifest.json (built by Vite).

// must match MEDIA_CACHE in sw/sw.ts
export const MEDIA_CACHE = 'fl-media-v1'
const DONE_KEY = 'fl-offline-built'

export interface OfflineItem { url: string; size: number }
export interface OfflineManifest { built: number; files: OfflineItem[]; remote: OfflineItem[] }

export const offlineSupported = () => 'serviceWorker' in navigator && 'caches' in window

export async function loadManifest(): Promise<OfflineManifest | null> {
  try {
    const res = await fetch('/offline-manifest.json', { cache: 'no-cache' })
    if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) return null
    return (await res.json()) as OfflineManifest
  } catch {
    return null
  }
}

export function isDownloaded(m: OfflineManifest) {
  try { return localStorage.getItem(DONE_KEY) === String(m.built) } catch { return false }
}

export const totalBytes = (m: OfflineManifest) => m.files.reduce((s, f) => s + f.size, 0)

export interface Progress { done: number; total: number; bytes: number; failed: number }

// A file shipped once and then replaced (the first, heavier walkthrough video). Devices that
// already stored it drop it from the offline cache on their next open.
const REMOVED_FILES = ['/media/walkthrough.mp4']
async function dropRemovedFiles() {
  try {
    const cache = await caches.open(MEDIA_CACHE)
    await Promise.all(REMOVED_FILES.map((u) => cache.delete(u)))
  } catch { /* no cache API */ }
}

let downloadPaused = false
/** Pauses the background download between files (e.g. while the walkthrough video plays). */
export function setDownloadPaused(v: boolean) { downloadPaused = v }

/** Downloads everything not already cached. Resolves with the number of failures. */
export async function downloadAll(
  m: OfflineManifest,
  onProgress: (p: Progress) => void,
  signal: AbortSignal,
  concurrency = 4,
): Promise<number> {
  const cache = await caches.open(MEDIA_CACHE)
  try { await navigator.storage?.persist?.() } catch { /* ignore */ }

  const items = [...m.files, ...m.remote]
  const p: Progress = { done: 0, total: items.length, bytes: 0, failed: 0 }
  onProgress({ ...p })
  let i = 0

  const worker = async () => {
    while (!signal.aborted) {
      // hold still while a video is playing, so the download does not compete with it
      while (downloadPaused && !signal.aborted) await new Promise((r) => setTimeout(r, 500))
      const item = items[i++]
      if (!item) return
      try {
        if (!(await cache.match(item.url))) {
          const remote = item.url.startsWith('http')
          const res = await fetch(item.url, remote ? { mode: 'cors', credentials: 'omit', signal } : { signal })
          // a 4xx is permanent (dead link) - skip it instead of failing the whole download
          if (res.status >= 400 && res.status < 500) { p.done++; onProgress({ ...p }); continue }
          if (!res.ok || res.status !== 200) throw new Error(String(res.status))
          // Vercel's SPA rewrite answers unknown paths with index.html - never cache that as an asset
          if ((res.headers.get('content-type') || '').includes('text/html')) throw new Error('html')
          await cache.put(item.url, res)
        }
        p.bytes += item.size
      } catch {
        if (signal.aborted) return
        p.failed++
      }
      p.done++
      onProgress({ ...p })
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  if (!signal.aborted && p.failed === 0) {
    try { localStorage.setItem(DONE_KEY, String(m.built)) } catch { /* ignore */ }
  }
  return p.failed
}

let autoRunning = false

/**
 * Silent background download of everything (no UI). Runs shortly after the app opens,
 * only when online, not on a metered/cellular link and not in data-saver mode. If it
 * is cut short (tab closed, connection lost) it simply resumes on the next open or as
 * soon as the connection returns - files already stored are skipped.
 */
export function autoDownload() {
  if (import.meta.env.DEV || !offlineSupported()) return
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; type?: string } }).connection
  void dropRemovedFiles()
  const run = async () => {
    if (autoRunning || !navigator.onLine) return
    if (conn?.saveData || conn?.type === 'cellular') return
    const m = await loadManifest()
    if (!m || isDownloaded(m)) return
    autoRunning = true
    try { await downloadAll(m, () => {}, new AbortController().signal, 3) } finally { autoRunning = false }
  }
  const start = () => setTimeout(run, 4000)
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
  window.addEventListener('online', start)
}
