import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from '../Components/Header/Header'
import Navbar from '../Components/Navbar/Navbar'
import Homepage from '../Pages/Homepage'
import Location from '../Pages/Location'
import FloorPlan from '../Pages/FloorPlan'
import VrTour from '../Pages/VrTour'
import Amenities from '../Pages/Amenities'
import Media from '../Pages/Media'
import NotFound from '../Pages/NotFound'

/** Header + floating navbar persist across every route. */
const Layout = () => (
  <div className="relative min-h-dvh w-full">
    <Header />
    <main>
      <Outlet />
    </main>
    <Navbar />
  </div>
)

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/location" element={<Location />} />
          <Route path="/floor-plan" element={<FloorPlan />} />
          <Route path="/vr-tour" element={<VrTour />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/media" element={<Media />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
