import { useState } from 'react'
import MasterplanGround from '../assets/floorplan/masterplan-ground.png'
import MasterplanTerrace from '../assets/floorplan/masterplan-terrace.png'
import Sidebar from '../Components/Navbar/Sidebar'

export default function MasterplanPage() {
  const [isTerrace, setIsTerrace] = useState(false)

  const handleLayoutSelect = (layout: string) => {
    setIsTerrace(layout === 'Terrace layout')
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute left-0 top-0 z-[999]">
        <Sidebar onLayoutSelect={handleLayoutSelect} />
      </div>

      <div className="flex h-full w-full items-center justify-center p-4 pl-24 sm:pl-[17rem]">
        <div className="relative max-h-full max-w-full">
          {/* Soft brand-red glow behind the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] bg-[#e8321c]/40 blur-3xl sm:-inset-10"
          />
          <div className="max-h-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-2 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-3">
            <div className="relative max-h-[88vh] max-w-full overflow-hidden rounded-lg border border-white/20">
              {/* invisible sizer - gives the box real dimensions since the
                  cross-fading images below are all position:absolute and
                  wouldn't otherwise contribute any size */}
              <img
                src={MasterplanGround}
                alt=""
                aria-hidden
                className="invisible max-h-[88vh] max-w-full object-contain"
              />
              {/* both stay mounted so the layout switch cross-fades instead of flashing */}
              {[
                { src: MasterplanGround, active: !isTerrace },
                { src: MasterplanTerrace, active: isTerrace },
              ].map(({ src, active }) => (
                <img
                  key={src}
                  src={src}
                  alt="Project Masterplan"
                  className={[
                    'absolute inset-0 size-full object-contain transition-opacity duration-[900ms] ease-in-out',
                    active ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}