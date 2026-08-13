import Masterplan from '../assets/floorplan/masterplan.png'
import Sidebar from '../components/Navbar/Sidebar'

export default function MasterplanPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute left-0 top-0 z-[999]">
        <Sidebar />
      </div>

      <img 
        src={Masterplan} 
        alt="Project Masterplan" 
        className="h-full w-full object-cover"
      />
    </div>
  )
}