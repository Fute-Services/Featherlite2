import { useState, useEffect, useRef } from 'react'

import building from '../assets/floorplan/Floorplan_Building.png'
import Building from '../Components/FloorPlanPages/Building'
import Table from '../Components/FloorPlanPages/Table'

import { type FloorData } from '../types/Floorplan'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../Components/Navbar/Sidebar'
const FLOORS: FloorData[] = [
    {
        id: 'terrace', name: 'Terrace', label: 'Terrace', area: 'N/A',
        polygon: '1242,267 1242,358 2708,365 2708,274', centerY: 316,

    },
    { id: '10th', name: '10th Floor', label: '10th', area: '30,626 sqft', polygon: '1245,362 1245,471 2701,471 2704,362', centerY: 416 },
    { id: '9th', name: '9th Floor', label: '9th', area: '27,817 sqft', polygon: '1249,471 1249,583 2704,583 2704,474', centerY: 528 },
    { id: '8th', name: '8th Floor', label: '8th', area: '28,394 sqft', polygon: '1238,573,1235,703,2711,703,2708,580', centerY: 644 },
    { id: '7th', name: '7th Floor', label: '7th', area: '30,626 sqft', polygon: '1235,712 1231,842 2704,835 2704,716', centerY: 776 },
    { id: '6th', name: '6th Floor', label: '6th', area: '27,817 sqft', polygon: '1242,840 1242,959 2708,962 2708,843', centerY: 901 },
    { id: '5th', name: '5th Floor', label: '5th', area: '30,626 sqft', polygon: '1242,961 1242,1101 2708,1097 2708,964', centerY: 1030 },
    { id: '4th', name: '4th Floor', label: '4th', area: '30,394 sqft', polygon: '1245,1093 1242,1219 2704,1219 2701,1100', centerY: 1158 },
    { id: '3rd', name: '3rd Floor', label: '3rd', area: '30,626 sqft', polygon: '1242,1215 1242,1335 2708,1349 2704,1222', centerY: 1280 },
    { id: '2nd', name: '2nd Floor', label: '2nd', area: '30,642 sqft', polygon: '1242,1338 1242,1468 2704,1461 2701,1342', centerY: 1402 },
    { id: '1st', name: '1st Floor', label: '1st', area: '23,642 sqft', polygon: '1238,1464 1238,1587 2708,1580 2704,1464', centerY: 1524 },
    { id: 'ground', name: 'Ground Floor', label: 'Ground', area: '20,200 sqft', polygon: '1238,1583 1238,1748 2715,1741 2715,1580', centerY: 1663 },
]

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

    const handleOpenUnitPlan = (id: string) => {
        navigate(`/unitplan/${id}`);
    };
    return (
        <div className="relative ibm-plex-sans  h-screen w-screen
         bg-slate-950 overflow-hidden select-none flex flex-col md:flex-row items-center justify-center">
          {/* <div className='absolute z-[999] left-0 top-0'> */}
            <Sidebar />
            {/* </div> */}

            <Building TOWER_X_RIGHT={TOWER_X_RIGHT} handleOpenUnitPlan={handleOpenUnitPlan} activeFloor={activeFloor} FLOORS={FLOORS} handleFloorSelect={handleFloorSelect}
                aspectRatio={aspectRatio} building={building} selectedFloorId={selectedFloorId} />


            <Table FLOORS={FLOORS} handleOpenUnitPlan={handleOpenUnitPlan} selectedFloorId={selectedFloorId} handleFloorSelect={handleFloorSelect} itemRefs={itemRefs} />




        </div>
    )
}