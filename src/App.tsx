import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import DestinationDetail from "./pages/DestinationDetail"
import Destinations from "./pages/Destinations"
import Booking from "./pages/Booking"
import Tours from "./pages/Tours"
import About from "./pages/About"
import Contact from "./pages/Contact"
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
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="booking" element={<Booking />} />
      </Route>
    </Routes>
  </>
)

export default App