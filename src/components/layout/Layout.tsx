import { useLocation, useOutlet } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { cloneElement } from "react"
import type { ReactElement } from "react"
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
      <Footer />
    </div>
  )
}

export default Layout