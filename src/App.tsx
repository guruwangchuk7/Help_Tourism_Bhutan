import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import ScrollToTop from "./components/layout/ScrollToTop"
import { PageSkeleton } from "./components/common/Skeleton"

// Lazy load route pages for performance optimization
const Home = lazy(() => import("./pages/Home"))
const Destinations = lazy(() => import("./pages/Destinations"))
const DestinationDetail = lazy(() => import("./pages/DestinationDetail"))
const Tours = lazy(() => import("./pages/Tours"))
const TourDetail = lazy(() => import("./pages/TourDetail"))
const Booking = lazy(() => import("./pages/Booking"))
const TripBuilder = lazy(() => import("./pages/TripBuilder"))
const Faq = lazy(() => import("./pages/Faq"))
const About = lazy(() => import("./pages/About"))
const Contact = lazy(() => import("./pages/Contact"))
const Hotels = lazy(() => import("./pages/Hotels"))
const Flights = lazy(() => import("./pages/Flights"))
const SdfInfo = lazy(() => import("./pages/SdfInfo"))
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"))

const App = () => (
  <>
    <ScrollToTop />
    <Suspense fallback={<PageSkeleton cardCount={3} />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/:id" element={<DestinationDetail />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:id" element={<TourDetail />} />
          <Route path="plan" element={<TripBuilder />} />
          <Route path="faq" element={<Faq />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="booking" element={<Booking />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="flights" element={<Flights />} />
          <Route path="sdf" element={<SdfInfo />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  </>
)

export default App