import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Compass, Globe } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false)
  }, [location])

  // Scroll Lock for Mobile Menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stays', path: '/destinations' },
    { name: 'Flights', path: '/tours' },
    { name: 'Packages', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ]

  // Animation variants for smooth sticky transition
  const headerVariants = {
    initial: { backgroundColor: 'rgba(255, 255, 255, 0)', boxShadow: 'none', borderBottom: '1px solid transparent' },
    scrolled: {
      backgroundColor: 'rgba(250, 250, 250, 0.95)',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
      borderBottom: '1px solid rgba(26, 26, 29, 0.05)',
      paddingTop: '20px',
      paddingBottom: '20px'
    }
  }

  const activeHeader = isScrolled || !isHome

  return (
    <motion.header
      initial="initial"
      animate={activeHeader ? "scrolled" : "initial"}
      variants={headerVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-0 left-0 w-full z-[100] transition-colors ${!activeHeader ? 'py-8' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <Compass className={`w-7 h-7 transition-all duration-300 group-hover:rotate-45 ${activeHeader ? 'text-accent' : 'text-white'}`} />
          <span className={`text-2xl font-heading font-semibold tracking-wide ${activeHeader ? 'text-primary' : 'text-white'}`}>
            WanderVista
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 relative lg:after:content-[''] lg:after:absolute lg:after:-bottom-2 lg:after:left-1/2 lg:after:-translate-x-1/2 lg:after:w-1 lg:after:h-1 lg:after:bg-accent lg:after:rounded-full lg:after:opacity-0 lg:hover:after:opacity-100 lg:after:transition-opacity ${activeHeader
                ? 'text-primary/70 hover:text-primary'
                : 'text-white/80 hover:text-white'
                } ${location.pathname === link.path ? '!text-accent lg:after:opacity-100 lg:after:bg-accent' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className={`flex items-center space-x-2 cursor-pointer transition-colors ${activeHeader ? 'text-primary hover:text-accent' : 'text-white hover:text-white/80'}`}>
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">EN</span>
          </div>
          <Link
            to="#"
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeHeader ? 'text-primary hover:text-accent' : 'text-white hover:text-white/80'}`}
          >
            Log In
          </Link>
          <Link
            to="/booking"
            className={`btn-accent !px-8 !py-3 !rounded-full shadow-none ${activeHeader ? '' : 'bg-white text-primary hover:bg-white hover:text-primary'}`}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden p-2 transition-colors relative z-[130] ${activeHeader || mobileMenuOpen ? 'text-primary' : 'text-white'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#FAFAFA] z-[120] lg:hidden flex flex-col p-8 pt-32 h-screen w-screen overflow-y-auto"
          >
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-4xl font-heading font-medium text-primary hover:text-accent transition-colors py-2 border-b border-primary/5"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-10 flex flex-col space-y-4">
                <Link to="/booking" className="btn-primary w-full text-lg">Sign Up</Link>
                <Link to="#" className="btn-outline w-full text-lg">Log In</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header