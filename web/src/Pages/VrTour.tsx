import { useEffect, useState, useRef, useCallback } from 'react'
import { Plus, Minus } from 'lucide-react'
import { PanoViewer } from '../Components/VrTour/panoViewer'
import { FIRST_SCENE, vrCategories } from '../Components/VrTour/tourData'

declare global {
  interface Window {
    /** Test hook - see PanoViewer.markerScreenPositions(). */
    __vrTour?: {
      scene: () => string
      markers: () => ReturnType<PanoViewer['markerScreenPositions']>
      camera: () => PanoViewer['cameraAngles']
      transitioning: () => boolean
      hovered: () => string | null
      cursorRing: () => boolean
    }
  }
}


export default function Vr() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<PanoViewer | null>(null)
  const [currentScene, setCurrentScene] = useState<string>(FIRST_SCENE)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const viewer = new PanoViewer(container, {
      onSceneChange: setCurrentScene,
    })
    viewerRef.current = viewer
    void viewer.load(FIRST_SCENE)

    window.__vrTour = {
      scene: () => viewer.currentScene,
      markers: () => viewer.markerScreenPositions(),
      camera: () => viewer.cameraAngles,
      transitioning: () => viewer.isTransitioning,
      hovered: () => viewer.hoveredLabel,
      cursorRing: () => viewer.cursorRingVisible,
    }

    return () => {
      delete window.__vrTour
      viewerRef.current = null
      viewer.dispose()
    }
  }, [])

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Virtual Tour', url: window.location.href })
      } catch {
        // user cancelled share sheet, nothing to do
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }, [])

  const sceneName = (() => {
    for (const cat of Object.values(vrCategories)) {
      const match = cat.find((item) => item.id === currentScene)
      if (match) return match.name
    }
    return currentScene.replace(/^(ext_|int_)/, '').replace(/_/g, ' ').toUpperCase()
  })()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      {/* Share Button */}
      <button
        onClick={handleShare}
        aria-label="Share"
        className="absolute top-8 right-8 sm:top-6 sm:right-6 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors shadow-lg"
      >
        {shareCopied ? (
          <span className="text-[10px] font-medium whitespace-nowrap px-1">Copied!</span>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          </svg>
        )}
      </button>

      {/* Zoom Controls */}
      <div className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 p-1.5 rounded-full bg-gradient-to-b from-black/50 via-black/60 to-black/70 backdrop-blur-xl backdrop-saturate-150 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.37)]">
        <button
          onClick={() => viewerRef.current?.zoomIn()}
          aria-label="Zoom In"
          className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#FF0000]/85 backdrop-blur-sm border border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(231,0,0,0.4)] hover:bg-[#FF0000] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
        <div className="w-6 h-px bg-white/15" />
        <button
          onClick={() => viewerRef.current?.zoomOut()}
          aria-label="Zoom Out"
          className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
      </div>

      {/*
        The hovered ring's name is written into this container imperatively by
        the viewer - see PanoViewer.updateHoverLabel(). It has to follow the ring
        every frame, which is not something to route through React state.
      */}
      <div ref={containerRef} id="pan-container" className="relative w-full h-full" />


      {/* Active Scene Display Label */}
      {/* Clear of the site navbar, which sits along the bottom of this route. */}
      <div className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-md text-white px-5 py-2 rounded-full border border-white/10 shadow-2xl font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase text-center whitespace-nowrap">
          {sceneName}
        </div>
      </div>
    </div>
  )
}
