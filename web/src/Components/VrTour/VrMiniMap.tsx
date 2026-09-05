import { useState, useEffect } from 'react'
import { Map, X } from 'lucide-react'

const MasterplanGround =
  'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/masterplan-2-jpg/web2560'
const MasterplanTerrace =
  'https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite/floorplan/terrace-plan-2-jpg/web2560'

interface MapPin {
  id: string
  name: string
  x: number // percentage from left
  y: number // percentage from top
}

const GROUND_PINS: MapPin[] = [
  { id: 'ext_entry_gate', name: 'Entry Gate', x: 39.8, y: 27.8 },
  { id: 'ext_entry_perspective', name: 'Entry Perspective', x: 42.5, y: 38.0 },
  { id: 'ext_drop_off_area', name: 'Arrival Plaza', x: 46.0, y: 49.0 },
  { id: 'int_reception_lobby', name: 'Reception Lobby', x: 51.7, y: 47.7 },
  { id: 'int_lift_lobby', name: 'Lift Lobby', x: 57.5, y: 50.9 },
  { id: 'int_gf_cafe_waiting', name: 'GF Cafe', x: 57.5, y: 62.0 },
  { id: 'ext_open_seating', name: 'Open Seating Area', x: 71.7, y: 73.1 },
  { id: 'ext_kids_play_area', name: 'Kids Play Area', x: 75.9, y: 30.7 },
]

const TERRACE_PINS: MapPin[] = [
  { id: 'int_lift_lobby_2', name: 'Lift Lobby', x: 54.0, y: 49.5 },
  { id: 'ext_multipurpose_court', name: 'Multipurpose Court', x: 55.0, y: 62.9 },
  { id: 'ext_terrace_cafe_1', name: 'Terrace Cafe 1', x: 60.9, y: 50.5 },
  { id: 'ext_terrace_cafe_2', name: 'Terrace Cafe 2', x: 56.2, y: 34.1 },
]

interface VrMiniMapProps {
  currentScene: string
  onSelectScene: (sceneId: string) => void
}

export default function VrMiniMap({ currentScene, onSelectScene }: VrMiniMapProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null)

  const isTerraceScene =
    currentScene.includes('terrace') ||
    currentScene.includes('multipurpose') ||
    currentScene === 'int_lift_lobby_2'
  const [activeTab, setActiveTab] = useState<'ground' | 'terrace'>(
    isTerraceScene ? 'terrace' : 'ground'
  )

  // Auto-switch tab based on current active scene
  useEffect(() => {
    setActiveTab(isTerraceScene ? 'terrace' : 'ground')
  }, [isTerraceScene])

  const handleTabChange = (tab: 'ground' | 'terrace') => {
    setActiveTab(tab)
    setHoveredPinId(null)
    if (tab === 'terrace' && !isTerraceScene) {
      onSelectScene('ext_terrace_cafe_1')
    } else if (tab === 'ground' && isTerraceScene) {
      onSelectScene('ext_entry_gate')
    }
  }

  const activePins = activeTab === 'terrace' ? TERRACE_PINS : GROUND_PINS
  const activeMapImg = activeTab === 'terrace' ? MasterplanTerrace : MasterplanGround

  const hoveredPin = activePins.find((p) => p.id === hoveredPinId)
  const activePin = activePins.find((p) => p.id === currentScene)
  const currentLabel = hoveredPin?.name || activePin?.name || ''

  if (!isOpen) {
    return (
      <div className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/[0.18] bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.25),inset_-1px_-1px_1px_rgba(0,0,0,0.3),0_12px_32px_rgba(0,0,0,0.75)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 hover:scale-105 hover:bg-black/70 active:scale-95 cursor-pointer"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
          />
          <Map className="w-4 h-4 text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]" />
          <span className="[text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">Map</span>
        </button>
      </div>
    )
  }

  return (
    <div className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 w-[230px] sm:w-[275px] md:w-[300px] z-40 transition-all duration-300 ease-out">
      {/* Edge-to-edge Map Container with Liquid Sheen */}
      <div className="relative w-full aspect-[2593/1589] rounded-2xl overflow-hidden border border-white/[0.22] shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.3),inset_-1px_-1px_1px_rgba(0,0,0,0.4),0_20px_45px_-10px_rgba(0,0,0,0.9)] backdrop-blur-md select-none group">
        {/* Top-edge liquid reflection */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/90 to-transparent z-20"
        />

        {/* Masterplan Image */}
        <img
          src={activeMapImg}
          alt="Masterplan"
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="lazy"
        />

        {/* Floating Top Controls (Ground/Terrace & Actions) directly over map */}
        <div className="absolute top-2 inset-x-2 flex items-center justify-between z-20 pointer-events-none">
          {/* Ground / Terrace liquid pill */}
          <div className="flex items-center bg-black/60 backdrop-blur-xl rounded-full p-0.5 border border-white/20 shadow-lg pointer-events-auto">
            <button
              onClick={() => handleTabChange('ground')}
              className={`px-2 py-0.5 text-[9px] sm:text-[10px] rounded-full font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'ground'
                  ? 'bg-[#FF0000] text-white shadow-[0_0_10px_rgba(255,0,0,0.6),inset_1px_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-white/80 hover:text-white hover:bg-white/[0.1]'
              }`}
            >
              Ground
            </button>
            <button
              onClick={() => handleTabChange('terrace')}
              className={`px-2 py-0.5 text-[9px] sm:text-[10px] rounded-full font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'terrace'
                  ? 'bg-[#FF0000] text-white shadow-[0_0_10px_rgba(255,0,0,0.6),inset_1px_1px_0_rgba(255,255,255,0.4)]'
                  : 'text-white/80 hover:text-white hover:bg-white/[0.1]'
              }`}
            >
              Terrace
            </button>
          </div>

          {/* Right Action Button (Close) */}
          <div className="flex items-center bg-black/60 backdrop-blur-xl rounded-full p-0.5 border border-white/20 shadow-lg pointer-events-auto">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close map"
              className="flex items-center justify-center p-1 rounded-full text-white/80 hover:text-white hover:bg-white/[0.15] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive scene button pins directly over map */}
        {activePins.map((pin) => {
          const isActive = currentScene === pin.id
          const isHovered = hoveredPinId === pin.id

          return (
            <button
              key={pin.id}
              onClick={() => onSelectScene(pin.id)}
              onMouseEnter={() => setHoveredPinId(pin.id)}
              onMouseLeave={() => setHoveredPinId(null)}
              onFocus={() => setHoveredPinId(pin.id)}
              onBlur={() => setHoveredPinId(null)}
              title={pin.name}
              aria-label={`Go to ${pin.name}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center group/pin z-10 cursor-pointer focus:outline-none"
            >
              {/* Pin node (clean, solid, no blinking, smooth hover highlight) */}
              <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#FF0000] border-2 border-white ring-2 ring-[#FF0000]/60 shadow-[0_0_10px_rgba(255,0,0,0.8),inset_1px_1px_0_rgba(255,255,255,0.5)] scale-110'
                    : isHovered
                    ? 'w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#FF0000] border-2 border-white scale-125 shadow-[0_0_12px_rgba(255,0,0,0.9)]'
                    : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white/95 border border-black/40 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0.5px_0.5px_0_rgba(255,255,255,0.6)]'
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${isActive || isHovered ? 'bg-white' : 'bg-black/70'}`}
                />
              </div>
            </button>
          )
        })}

        {/* Dedicated Bottom Info Pill - Solid Deep Black with Luxury Text */}
        {currentLabel && (
          <div className="absolute bottom-2.5 inset-x-2 flex items-center justify-center pointer-events-none z-20">
            <span className="relative overflow-hidden rounded-xl border border-white/[0.18] bg-black/90 backdrop-blur-xl px-3.5 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] text-[#E6D7BA] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.2),inset_-1px_-1px_1px_rgba(0,0,0,0.4),0_12px_28px_-6px_rgba(0,0,0,0.9)] whitespace-nowrap transition-all duration-300">
              {/* Liquid glass sheen along the top edge */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-2 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
              />
              {currentLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

