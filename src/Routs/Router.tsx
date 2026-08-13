import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import Navbar from '../components/Navbar/Navbar'
import Homepage from '../Pages/Homepage'
import Location from '../Pages/Location'
import FloorPlan from '../Pages/FloorPlanPage'
import VrTour from '../Pages/VrTour'
import Amenities from '../Pages/Amenities'
import Media from '../Pages/Media'
import NotFound from '../Pages/NotFound'
import UnitPlanPage from '../Pages/UnitPlanPage'
import MasterplanPage from '../Pages/MasterPlanPage'

/** Full Layout: Includes Header + Navbar */
const MainLayout = () => (
  <div className="relative min-h-dvh w-full">
    <Header />
    <main>
      <Outlet />
    </main>
    <Navbar />
  </div>
)

/** Minimal Layout: Header only (No Navbar) */
const PlainLayout = () => (
  <div className="relative min-h-dvh w-full">
    <Header />
    <main>
      <Outlet />
    </main>
  </div>
)

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes WITH Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/location" element={<Location />} />
          <Route path="/masterplan" element={<MasterplanPage/>}/>
          <Route path="/floor-plan" element={<FloorPlan />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/media" element={<Media />} />
        </Route>

        {/* Routes WITHOUT Navbar (e.g. full-screen VR Tour or Unit Plan) */}
        <Route element={<PlainLayout />}>
          <Route path="/vr-tour" element={<VrTour />} />
          <Route path="/unitplan/:idnew" element={<UnitPlanPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router