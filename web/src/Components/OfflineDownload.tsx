import { useEffect, useRef, useState } from 'react'
import { Download, CheckCircle2, WifiOff, X } from 'lucide-react'
import {
  downloadAll, isDownloaded, loadManifest, offlineSupported, totalBytes,
  type OfflineManifest, type Progress,
} from '../lib/offlineCache'

const mb = (b: number) => `${Math.round(b / 1048576)} MB`

/** Small pill (bottom-left) to download the whole app for offline use. */
export default function OfflineDownload() {
  const [manifest, setManifest] = useState<OfflineManifest | null>(null)
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'partial'>('idle')
  const [progress, setProgress] = useState<Progress | null>(null)
  const [hidden, setHidden] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  useEffect(() => {
    if (!offlineSupported() || import.meta.env.DEV) return
    loadManifest().then((m) => {
      if (!m) return
      setManifest(m)
      if (isDownloaded(m)) setState('done')
    })
  }, [])

  if (!manifest || hidden) return null

  const start = async () => {
    const ac = new AbortController()
    abortRef.current = ac
    setState('running')
    const failed = await downloadAll(manifest, setProgress, ac.signal)
    if (!ac.signal.aborted) setState(failed ? 'partial' : 'done')
  }
  const cancel = () => { abortRef.current?.abort(); setState('idle') }

  const pct = progress ? Math.round((progress.done / Math.max(progress.total, 1)) * 100) : 0
  const base = 'fixed bottom-3 left-3 z-[2000] flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3 py-2 text-xs text-white shadow-2xl backdrop-blur-xl'

  if (state === 'done') {
    return (
      <div className={`${base} cursor-pointer opacity-80`} onClick={() => setHidden(true)} role="status" title="Hide">
        <CheckCircle2 className="size-4 text-emerald-400" />
        <span>Offline ready</span>
      </div>
    )
  }
  if (state === 'running') {
    return (
      <div className={`${base} min-w-56 flex-col items-stretch rounded-2xl`} role="status">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold">Downloading for offline… {pct}%</span>
          <button onClick={cancel} aria-label="Cancel download" className="cursor-pointer text-white/70 hover:text-white"><X className="size-4" /></button>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-[#C89D54] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-white/60">{progress ? `${progress.done}/${progress.total} files` : ''} · keep this tab open</span>
      </div>
    )
  }
  if (!online) {
    return <div className={base} role="status"><WifiOff className="size-4 text-amber-300" /><span>Offline</span></div>
  }
  return (
    <button onClick={start} className={`${base} cursor-pointer hover:border-[#C89D54]`}>
      <Download className="size-4 text-[#C89D54]" />
      <span>{state === 'partial' ? 'Some files failed - retry' : `Download for offline (~${mb(totalBytes(manifest))})`}</span>
    </button>
  )
}
