import { useState } from 'react'
import Masterplan from '../assets/floorplan/masterplan5.png'
import TerracePlan from '../assets/floorplan/Terrace Plan.png'
import Sidebar from '../Components/Navbar/Sidebar'

export default function MasterplanPage() {
  const [currentPlan, setCurrentPlan] = useState<string>('Ground layout')

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Sidebar onLayoutSelect={(layout) => setCurrentPlan(layout)} />

      <svg className="w-full h-full bg-black touch-none">
        <image
          href={currentPlan === 'Terrace layout' ? TerracePlan : Masterplan}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid none"
        />
      </svg>
    </div>
  )
}