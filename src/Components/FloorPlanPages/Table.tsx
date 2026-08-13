import { type RefObject } from 'react'
// import { FloorData } from '../../types/Floorplan'
import {type FloorData } from '../../types/Floorplan'


interface TableProps {
  FLOORS: FloorData[]
  selectedFloorId: string
   handleOpenUnitPlan: (id: string) => void;
  handleFloorSelect: (id: string) => void
  itemRefs: RefObject<Map<string, HTMLButtonElement | null>>
}

export default function Table({
  FLOORS,
  selectedFloorId,
  handleOpenUnitPlan,
  handleFloorSelect,
  itemRefs,
}: TableProps) {
  return (
    <div className="absolute bottom-4 left-4 right-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-8 md:left-auto md:w-64 z-20">
      <div className="bg-black/30 backdrop-blur-xs rounded-2xl md:rounded-3xl p-4 text-white border border-white/10">
        {/* Table Header */}
        <div className="grid grid-cols-2 text-sm font-semibold text-slate-300 pb-3 border-b border-white/10 px-3">
          <span className="text-left">Floor</span>
          <span className="text-right">Tower area</span>
        </div>

        {/* Floor Selection List Container */}
        <div className="relative mt-2 max-h-[35vh] md:max-h-[55vh] overflow-y-auto [&&::-webkit-scrollbar]:w-0.5 [&&::-webkit-scrollbar-track]:bg-transparent [&&::-webkit-scrollbar-thumb]:bg-white/20 [&&::-webkit-scrollbar-thumb]:rounded-full hover:[&&::-webkit-scrollbar-thumb]:bg-white/40 pr-1">
          <div className="space-y-1 relative z-10">
            {FLOORS.map((floor) => {
              const isSelected = floor.id === selectedFloorId
              const isTerrace = floor.area === 'N/A' || floor.id === 'terrace'

              return (
                <div
                  key={floor.id}
                  className="relative border-b border-white/5 last:border-b-0 py-0.5"
                >
                  {!isTerrace && (
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/10 pointer-events-none z-0" />
                  )}

                  <button
                    ref={(el) => {
                      if (itemRefs.current) {
                        if (el) itemRefs.current.set(floor.id, el)
                        else itemRefs.current.delete(floor.id)
                      }
                    }}
                    onClick={() => handleOpenUnitPlan(`${floor.id}`)}
                    onMouseEnter={() => handleFloorSelect(floor.id)}
                    className={`relative z-10 w-full grid items-center py-2 rounded-full text-xs transition-colors duration-200 cursor-pointer outline-none focus:outline-none ${
                      isTerrace ? 'grid-cols-1 text-center px-2' : 'grid-cols-2 px-3'
                    } ${
                      isSelected
                        ? 'bg-red-500/25 border border-white/25 text-white font-medium shadow-md backdrop-blur-md'
                        : 'bg-transparent border border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {isTerrace ? (
                      <span className="font-light text-slate-200">{floor.label}</span>
                    ) : (
                      <>
                        <span className="text-left font-light pr-2">{floor.label}</span>
                        <span className="text-right font-light text-slate-300 pl-2">
                          {floor.area}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}