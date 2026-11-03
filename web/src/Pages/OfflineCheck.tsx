import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MEDIA_CACHE, downloadAll, isDownloaded, loadManifest, type OfflineManifest, type Progress,
} from '../lib/offlineCache'

// Hidden diagnostics page: /offline-check
// Open it on the device to see whether the service worker is live, how much is cached,
// and whether the key assets of Master Plan / Terrace / Media / Location really load.

const CDN = 'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite'
const PROBES: { label: string; kind: 'img' | 'video' | 'fetch' | 'range' | 'reach'; url: string }[] = [
  { label: 'Masterplan - Ground image', kind: 'img', url: `${CDN}/floorplan/masterplan-2-jpg/web2560` },
  { label: 'Masterplan - Terrace image', kind: 'img', url: `${CDN}/floorplan/terrace-plan-2-jpg/web2560` },
  { label: 'Hotspot - Lobby.png (33 MB)', kind: 'img', url: '/hotspot-images/Lobby.png' },
  { label: 'Hotspot - basement.jpg (31 MB)', kind: 'img', url: '/hotspot-images/basement.jpg' },
  { label: 'Hotspot - terrace/kiosk.jpg', kind: 'img', url: '/hotspot-images/terrace/kiosk.jpg' },
  { label: 'Hotspot - terrace/Multipurpose_Court', kind: 'img', url: '/hotspot-images/terrace/Multipurpose_Court.jpeg' },
  { label: 'Gallery - aerial-day-1.jpg', kind: 'img', url: '/gallery/aerial-day-1.jpg' },
  { label: 'VR - entry-gate.jpg', kind: 'img', url: '/vr-tour/entry-gate.jpg' },
  { label: 'VR (CDN) - reception-lobby', kind: 'img', url: `${CDN}/vr/reception-lobby/orig` },
  { label: 'Circulation video - ramp-access.mp4', kind: 'video', url: '/circulation-videos/ramp-access.mp4' },
  { label: 'Walkthrough - playlist (stored copy)', kind: 'fetch', url: '/media/walk-hls/index.m3u8' },
  { label: 'Walkthrough - first piece', kind: 'fetch', url: '/media/walk-hls/seg_000.m4s' },
  { label: 'Walkthrough - last piece', kind: 'fetch', url: '/media/walk-hls/seg_028.m4s' },
  { label: 'Vimeo reachable (needs internet)', kind: 'reach', url: 'https://player.vimeo.com/api/player.js' },
  { label: 'Brochure PDF (range request)', kind: 'range', url: '/media/brochure.pdf' },
  { label: 'Location tour - pano.xml', kind: 'fetch', url: '/location-tour/pano.xml' },
  { label: 'Location tour - tile', kind: 'img', url: '/location-tour/tiles/node2/cf_0/l_0/c_0/tile_0.jpg' },
]

type Row = { label: string; state: 'wait' | 'ok' | 'fail'; note: string }

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout ' + ms / 1000 + 's')), ms))])

async function probe(p: (typeof PROBES)[number]): Promise<string> {
  const t0 = performance.now()
  const ms = () => Math.round(performance.now() - t0) + ' ms'
  if (p.kind === 'img') {
    return withTimeout(new Promise<string>((res, rej) => {
      const i = new Image()
      i.onload = () => res(`${i.naturalWidth}x${i.naturalHeight}, ${ms()}`)
      i.onerror = () => rej(new Error('image error'))
      i.src = p.url // the exact url the app uses, so the service worker / cache answers it
    }), 40000)
  }
  if (p.kind === 'video') {
    return withTimeout(new Promise<string>((res, rej) => {
      const v = document.createElement('video')
      v.muted = true; v.preload = 'auto'
      v.onloadeddata = () => res(`${v.videoWidth}x${v.videoHeight}, ${ms()}`)
      v.onerror = () => rej(new Error('video error ' + (v.error?.code ?? '')))
      v.src = p.url
    }), 40000)
  }
  if (p.kind === 'reach') {
    // no-cors: success only means the connection (and its certificate) to that site works
    await withTimeout(fetch(p.url, { mode: 'no-cors', cache: 'no-store' }), 8000)
    return `reachable, ${ms()}`
  }
  const r = await withTimeout(fetch(p.url, p.kind === 'range' ? { headers: { Range: 'bytes=0-99' } } : undefined), 40000)
  if (!r.ok) throw new Error('HTTP ' + r.status)
  return `HTTP ${r.status}${p.kind === 'range' ? ' (range ok)' : ''}, ${ms()}`
}

export default function OfflineCheck() {
  const [info, setInfo] = useState<Record<string, string>>({})
  const [rows, setRows] = useState<Row[]>(PROBES.map((p) => ({ label: p.label, state: 'wait', note: '' })))
  const [manifest, setManifest] = useState<OfflineManifest | null>(null)
  const [prog, setProg] = useState<Progress | null>(null)
  const [running, setRunning] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const gather = useCallback(async () => {
    const out: Record<string, string> = {}
    out['Online'] = String(navigator.onLine)
    const conn = (navigator as unknown as { connection?: { type?: string; effectiveType?: string; saveData?: boolean } }).connection
    out['Connection'] = conn ? `${conn.type ?? '?'} / ${conn.effectiveType ?? '?'} / saveData=${conn.saveData}` : 'n/a'
    out['Installed (standalone)'] = String(window.matchMedia('(display-mode: fullscreen)').matches || window.matchMedia('(display-mode: standalone)').matches)
    const reg = await navigator.serviceWorker?.getRegistration()
    out['SW state'] = reg ? `${reg.active?.state ?? 'none'}${reg.waiting ? ' (+waiting)' : ''}${reg.installing ? ' (+installing)' : ''}` : 'NOT registered'
    out['SW controls this page'] = String(!!navigator.serviceWorker?.controller)
    try {
      const m = await loadManifest()
      setManifest(m)
      out['Build (manifest)'] = m ? new Date(m.built).toLocaleString() : 'manifest not readable'
      out['Expected files'] = m ? `${m.files.length} local + ${m.remote.length} remote` : '-'
      out['Download complete flag'] = m ? String(isDownloaded(m)) : '-'
    } catch { out['Build (manifest)'] = 'error' }
    try {
      const c = await caches.open(MEDIA_CACHE)
      out['Media cache entries'] = String((await c.keys()).length)
      out['All caches'] = (await caches.keys()).join(', ')
    } catch { out['Media cache entries'] = 'cache API error' }
    try {
      const e = await navigator.storage.estimate()
      out['Storage used / quota'] = `${Math.round((e.usage ?? 0) / 1048576)} MB / ${Math.round((e.quota ?? 0) / 1048576)} MB`
      out['Persistent storage'] = String(await navigator.storage.persisted())
    } catch { /* ignore */ }
    try {
      const gl = document.createElement('canvas').getContext('webgl') as WebGLRenderingContext | null
      out['WebGL max texture'] = gl ? String(gl.getParameter(gl.MAX_TEXTURE_SIZE)) : 'NO WEBGL'
    } catch { out['WebGL max texture'] = 'error' }
    out['Screen / DPR'] = `${innerWidth}x${innerHeight} @${devicePixelRatio}`
    out['Device memory (GB)'] = String((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 'n/a')
    out['User agent'] = navigator.userAgent
    setInfo(out)
  }, [])

  const runProbes = useCallback(async () => {
    setRows(PROBES.map((p) => ({ label: p.label, state: 'wait', note: 'running...' })))
    for (let i = 0; i < PROBES.length; i++) {
      let r: Row
      try { r = { label: PROBES[i].label, state: 'ok', note: await probe(PROBES[i]) } }
      catch (e) { r = { label: PROBES[i].label, state: 'fail', note: (e as Error).message } }
      setRows((prev) => prev.map((x, j) => (j === i ? r : x)))
    }
  }, [])

  useEffect(() => { void gather(); void runProbes() }, [gather, runProbes])

  const startDownload = async () => {
    if (!manifest) return
    const ac = new AbortController(); abortRef.current = ac; setRunning(true)
    await downloadAll(manifest, setProg, ac.signal, 2)
    setRunning(false); void gather()
  }

  const pre = 'text-xs break-all'
  return (
    <div className="min-h-dvh bg-[#04121f] p-4 text-white" style={{ overflowY: 'auto', height: '100dvh' }}>
      <h1 className="mb-3 text-xl font-semibold">Offline check</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="rounded bg-[#C89D54] px-3 py-2 text-sm font-semibold text-black" onClick={() => { void gather(); void runProbes() }}>Re-run checks</button>
        {!running
          ? <button className="rounded border border-white/30 px-3 py-2 text-sm" onClick={startDownload}>Download now (all media)</button>
          : <button className="rounded border border-white/30 px-3 py-2 text-sm" onClick={() => abortRef.current?.abort()}>Stop download</button>}
        <a className="rounded border border-white/30 px-3 py-2 text-sm" href="/">Back to app</a>
      </div>
      {prog && <p className="mb-3 text-sm">Download: {prog.done}/{prog.total} files, failed {prog.failed}{running ? ' ...' : ' (finished)'}</p>}

      <h2 className="mb-1 font-semibold">Device and cache</h2>
      <table className="mb-5 w-full text-left"><tbody>
        {Object.entries(info).map(([k, v]) => (
          <tr key={k} className="border-b border-white/10 align-top"><td className="py-1 pr-3 text-xs text-white/60">{k}</td><td className={pre}>{v}</td></tr>
        ))}
      </tbody></table>

      <h2 className="mb-1 font-semibold">Do the key assets load right now?</h2>
      <table className="w-full text-left"><tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-white/10 align-top">
            <td className="py-1 pr-3 text-xs">{r.label}</td>
            <td className={`${pre} ${r.state === 'ok' ? 'text-emerald-400' : r.state === 'fail' ? 'text-red-400' : 'text-white/50'}`}>{r.state === 'ok' ? 'OK ' : r.state === 'fail' ? 'FAIL ' : ''}{r.note}</td>
          </tr>
        ))}
      </tbody></table>
    </div>
  )
}
