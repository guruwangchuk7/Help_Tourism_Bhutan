import { useLocation, useOutlet } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { cloneElement } from "react"
import type { ReactElement } from "react"
import { MessageCircle } from "lucide-react"
import Header from "./Header"
import Footer from "./Footer"

const Layout = () => {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {outlet && cloneElement(outlet as ReactElement, { key: location.pathname })}
        </AnimatePresence>
      </main>
      
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/97517609800?text=Hello,%20I'd%20like%20help%20planning%20my%20Bhutan%20trip."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#20ba5a] hover:scale-105 transition-all duration-300 font-semibold text-sm group"
      >
        <MessageCircle className="w-5 h-5 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap lg:max-w-xs">
          Plan Your Bhutan Trip
        </span>
      </a>

      <Footer />
    </div>
  )
}

export default Layout