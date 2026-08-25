import { useState, useEffect, useRef } from 'react'

// import building from '../assets/floorplan/Floorplan_Building.png'

// import building from '../assets/floorplan/mainbuildingimage.jpeg'
// import building from '../assets/floorplan/mainbuilding1.png'
import Building from '../Components/FloorPlanPages/Building'
import building from '../assets/floorplan/buildingimage.jpg'
import Table from '../Components/FloorPlanPages/Table'

import { useNavigate } from 'react-router-dom'
import Sidebar from '../Components/Navbar/Sidebar'
import { FLOORS } from '../Data/FloorPlanData'

// Floor facade bounds (X-coordinates in SVG coordinate space)
const TOWER_X_RIGHT = 2708

export default function FloorPlanPage() {
    const [selectedFloorId, setSelectedFloorId] = useState<string>('')
    const [aspectRatio, setAspectRatio] = useState<string>('xMidYMid meet')
    const navigate = useNavigate();

    const activeFloor = FLOORS.find((f) => f.id === selectedFloorId)

    useEffect(() => {

        const mediaQuery = window.matchMedia('(min-width: 1024px)')

        const updateRatio = (e: MediaQueryListEvent | MediaQueryList) => {
            setAspectRatio(e.matches ? 'xMidYMid slice' : 'xMidYMid meet')
        }

        updateRatio(mediaQuery)
        mediaQuery.addEventListener('change', updateRatio)
        return () => mediaQuery.removeEventListener('change', updateRatio)
    }, [])


    const itemRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map())

    // Function to smoothly scroll the side menu item into view
    const scrollToFloor = (id: string) => {
        const node = itemRefs.current.get(id)
        if (node) {
            node.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', // Keeps scrolling minimal and clean inside the container
            })
        }
    }

    // Master handler for selecting a floor and scrolling to it
    const handleFloorSelect = (id: string) => {
        //    navigate(`/unitplan/${id}`);
        setSelectedFloorId(id)
        scrollToFloor(id)
    }

    const handleOpenUnitPlan = (id1: string) => {
        navigate(`/unitplan/${id1}`);
    };
    return (
        <div className="relative ibm-plex-sans  h-screen w-screen
         bg-slate-950 overflow-hidden select-none flex flex-col md:flex-row 
         items-center justify-center">
            {/* <div className='absolute z-[999] left-0 top-0'> */}
            <Sidebar />
            {/* </div> */}

            <Building TOWER_X_RIGHT={TOWER_X_RIGHT} handleOpenUnitPlan={handleOpenUnitPlan} activeFloor={activeFloor} FLOORS={FLOORS} handleFloorSelect={handleFloorSelect}
                aspectRatio={aspectRatio} building={building} selectedFloorId={selectedFloorId} />


            <Table FLOORS={FLOORS} handleOpenUnitPlan={handleOpenUnitPlan} selectedFloorId={selectedFloorId} handleFloorSelect={handleFloorSelect} itemRefs={itemRefs} />




        </div>
    )
}