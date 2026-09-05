import { useEffect, useState, useRef } from 'react'
import { Plus, Minus } from 'lucide-react'
import { PanoViewer } from '../Components/VrTour/panoViewer'
import { FIRST_SCENE, vrCategories } from '../Components/VrTour/tourData'
import VrMiniMap from '../Components/VrTour/VrMiniMap'
import { Sidebar } from '../Components/Navbar/Sidebar'

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

  const isInterior = vrCategories.Interior.some((item) => item.id === currentScene)
  const [vrMode, setVrMode] = useState<'exterior' | 'interior'>(
    isInterior ? 'interior' : 'exterior'
  )

  // Keep vrMode in sync with active scene
  useEffect(() => {
    setVrMode(isInterior ? 'interior' : 'exterior')
  }, [isInterior])

  const vrScenes = vrMode === 'interior' ? vrCategories.Interior : vrCategories.Exterior

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

  const handleSelectScene = (sceneId: string) => {
    if (viewerRef.current && sceneId !== currentScene) {
      void viewerRef.current.goTo(sceneId)
    }
  }

  const sceneName = (() => {
    for (const cat of Object.values(vrCategories)) {
      const match = cat.find((item) => item.id === currentScene)
      if (match) return match.name
    }
    return currentScene.replace(/^(ext_|int_)/, '').replace(/_/g, ' ').toUpperCase()
  })()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      {/* Sidebar for Category (Exterior / Interior) & Scene Navigation */}
      <Sidebar
        isVrTourPage={true}
        vrMode={vrMode}
        onVrModeChange={(mode) => {
          setVrMode(mode)
          const targetCategory = vrCategories[mode === 'interior' ? 'Interior' : 'Exterior']
          if (targetCategory && targetCategory.length > 0) {
            handleSelectScene(targetCategory[0].id)
          }
        }}
        vrScenes={vrScenes}
        activeSceneId={currentScene}
        onSceneSelect={handleSelectScene}
      />
      {/* Zoom Controls */}
      <div className="absolute right-3 sm:right-8 top-6 sm:top-6 z-50 flex flex-col items-center gap-1 p-1 rounded-full bg-gradient-to-b from-black/50 via-black/60 to-black/70 backdrop-blur-xl backdrop-saturate-150 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.37)]">
        <button
          onClick={() => viewerRef.current?.zoomIn()}
          aria-label="Zoom In"
          className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#FF0000]/85 backdrop-blur-sm border border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_12px_rgba(231,0,0,0.4)] hover:bg-[#FF0000] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
        </button>
        <div className="w-5 h-px bg-white/15" />
        <button
          onClick={() => viewerRef.current?.zoomOut()}
          aria-label="Zoom Out"
          className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
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
      <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-40 flex justify-center pointer-events-none px-4">
        <span
          key={sceneName}
          className="relative overflow-hidden rounded-xl border border-white/[0.1] bg-black/35 backdrop-blur-sm px-6 py-2.5 text-[10px] sm:text-sm font-medium uppercase tracking-[0.2em] text-[#E6D7BA] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),inset_-1px_-1px_1px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.8)] backdrop-saturate-150 whitespace-nowrap"
        >
          {/* Liquid glass sheen along the top edge */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
          />
          {sceneName}
        </span>
      </div>

      {/* Interactive Minimap (Masterplan) on the bottom right */}
      <VrMiniMap currentScene={currentScene} onSelectScene={handleSelectScene} />

      <style>{`
        .animate-pulse-glow {
          animation: pulse-glow 2.2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.35); }
          50% { box-shadow: 0 0 16px 5px rgba(255, 255, 255, 0.75); }
        }
      `}</style>
    </div>
  )
}

