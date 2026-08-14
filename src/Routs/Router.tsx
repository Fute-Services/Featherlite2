import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Header from '../Components/Header/Header'
import Navbar from '../Components/Navbar/Navbar'
import IntroCurtain from '../Components/Intro/IntroCurtain'
import Homepage from '../Pages/Homepage'
import Location from '../Pages/Location'
import FloorPlan from '../Pages/FloorPlanPage'
import VrTour from '../Pages/VrTour'
import Amenities from '../Pages/Amenities'
import Media from '../Pages/Media'
import NotFound from '../Pages/NotFound'
import UnitPlanPage from '../Pages/UnitPlanPage'
import MasterplanPage from '../Pages/MasterPlanPage'

// routes that keep the bottom pill Navbar - everything else (Unit Plan)
// hides it
const ROUTES_WITH_NAVBAR = ['/', '/location', '/amenities', '/media', '/vr-tour', '/masterplan', '/floor-plan']

/** Single persistent layout - Header (and Navbar, on the routes that use it)
 *  never unmount between navigations, page content swaps instantly. */
const Layout = () => {
  const { pathname } = useLocation()
  const showNavbar = ROUTES_WITH_NAVBAR.includes(pathname)

  return (
    <div className="relative min-h-dvh w-full">
      <Header />
      <main>
        <Outlet />
      </main>
      {showNavbar && <Navbar />}
    </div>
  )
}

const Router = () => {
  return (
    <BrowserRouter>
      <IntroCurtain />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/location" element={<Location />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/media" element={<Media />} />
          <Route path="/vr-tour" element={<VrTour />} />
          <Route path="/floor-plan" element={<FloorPlan />} />
          <Route path="/masterplan" element={<MasterplanPage />} />
          <Route path="/unitplan/:idnew" element={<UnitPlanPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
