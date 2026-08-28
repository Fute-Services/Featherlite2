import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Header from '../Components/Header/Header'
import Navbar from '../Components/Navbar/Navbar'
import IntroCurtain from '../Components/Intro/IntroCurtain'
import ErrorBoundary from '../Components/ErrorBoundary'
import Homepage from '../Pages/Homepage'
import Location from '../Pages/Location'

// Everything except the homepage is code-split: each route's JS (and the
// heavy images/video/three.js it pulls in) only downloads when visited.
const FloorPlan = lazy(() => import('../Pages/FloorPlanPage'))
const VrTour = lazy(() => import('../Pages/VrTour'))
const Amenities = lazy(() => import('../Pages/Amenities'))
const Media = lazy(() => import('../Pages/Media'))
const GalleryPage = lazy(() => import('../Pages/Media/GalleryPage'))
const CertificationsPage = lazy(() => import('../Pages/Media/CertificationsPage'))
const TechnicalSpecificationsPage = lazy(() => import('../Pages/Media/TechnicalSpecificationsPage'))
const NotFound = lazy(() => import('../Pages/NotFound'))
const UnitPlanPage = lazy(() => import('../Pages/UnitPlanPage'))
const MasterplanPage = lazy(() => import('../Pages/MasterPlanPage'))

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

/**
 * The routed screens, behind a crash guard. The guard sits *inside* the router
 * so a screen that throws does not take the shell down with it, and so moving
 * to another screen clears the error by itself.
 */
const RoutedScreens = () => {
  const location = useLocation()

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={null}>
        <Routes>
          {/* Routes WITH Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/location" element={<Location />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/media" element={<Media />} />
            <Route path="/media/gallery" element={<GalleryPage />} />
            <Route path="/certifications" element={<CertificationsPage />} />
            <Route path="/certifictions" element={<CertificationsPage />} />
            <Route path="/technical-specifications" element={<TechnicalSpecificationsPage />} />
            <Route path="/technicalspecifictions" element={<TechnicalSpecificationsPage />} />
            <Route path="/vr-tour" element={<VrTour />} />
            <Route path="/floor-plan" element={<FloorPlan />} />
            <Route path="/masterplan" element={<MasterplanPage />} />
            <Route path="/unitplan/:idnew" element={<UnitPlanPage />} />
          </Route>

          {/* Routes WITHOUT Navbar */}
          <Route element={<PlainLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

const Router = () => {
  return (
    <BrowserRouter>
      <IntroCurtain />
      <RoutedScreens />
    </BrowserRouter>
  )
}

export default Router
