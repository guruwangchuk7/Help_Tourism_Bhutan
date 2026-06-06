import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import DestinationDetail from "./pages/DestinationDetail"
import Destinations from "./pages/Destinations"
import Booking from "./pages/Booking"
import Tours from "./pages/Tours"
import TourDetail from "./pages/TourDetail"
import TripBuilder from "./pages/TripBuilder"
import Faq from "./pages/Faq"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Hotels from "./pages/Hotels"
import Flights from "./pages/Flights"
import SdfInfo from "./pages/SdfInfo"
import AdminDashboard from "./pages/AdminDashboard"
import ScrollToTop from "./components/layout/ScrollToTop"

const App = () => (
  <>
    <ScrollToTop />
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
  </>
)

export default App