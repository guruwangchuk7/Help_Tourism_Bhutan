import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import logoImg from '../../assets/logo/index.png'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isTransparentPage = ['/', '/contact', '/about', '/flights', '/hotels'].includes(location.pathname) ||
    location.pathname.startsWith('/tours') ||
    location.pathname.startsWith('/destinations')

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
    { name: 'Destinations', path: '/destinations' },
    { name: 'Tours', path: '/tours' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Flights', path: '/flights' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  // Animation variants for smooth sticky transition
  const headerVariants = {
    initial: { 
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)', 
      boxShadow: 'none', 
      borderBottom: '1px solid transparent',
      paddingTop: '32px',
      paddingBottom: '32px',
      backdropFilter: 'blur(0px)'
    },
    scrolled: {
      background: 'rgba(250, 250, 250, 0.95)',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
      borderBottom: '1px solid rgba(26, 26, 29, 0.05)',
      paddingTop: '20px',
      paddingBottom: '20px'
    }
  }

  const activeHeader = isScrolled || !isTransparentPage

  return (
    <motion.header
      initial="initial"
      animate={activeHeader ? "scrolled" : "initial"}
      variants={headerVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-[100]"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group relative z-[130] -top-[2px]">
          <img 
            src={logoImg} 
            alt="Help Tourism Bhutan Logo" 
            className="h-14 sm:h-18 w-auto object-contain transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105" 
          />
          <div className="flex flex-col items-center -space-y-0.5">
            <span className={`text-base sm:text-lg md:text-xl font-heading font-semibold tracking-wide transition-colors duration-300 ${
              activeHeader || mobileMenuOpen ? 'text-primary' : 'text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]'
            }`}>
              Help Tourism
            </span>
            <div className={`flex items-center space-x-1.5 transition-colors duration-300 ${
              activeHeader || mobileMenuOpen ? 'text-primary' : 'text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]'
            }`}>
              <div className="h-[1px] w-4 sm:w-6 bg-current opacity-40"></div>
              <span className="font-heading font-bold text-[11px] sm:text-xs tracking-wider">
                Bhutan
              </span>
              <div className="h-[1px] w-4 sm:w-6 bg-current opacity-40"></div>
            </div>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 relative lg:after:content-[''] lg:after:absolute lg:after:-bottom-2 lg:after:left-1/2 lg:after:-translate-x-1/2 lg:after:w-1 lg:after:h-1 lg:after:bg-accent lg:after:rounded-full lg:after:opacity-0 lg:hover:after:opacity-100 lg:after:transition-opacity ${activeHeader
                ? 'text-primary/70 hover:text-primary'
                : 'text-white/80 hover:text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]'
                } ${location.pathname === link.path ? '!text-accent lg:after:opacity-100 lg:after:bg-accent' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className={`flex items-center space-x-1 cursor-pointer transition-colors ${activeHeader ? 'text-primary hover:text-accent' : 'text-white hover:text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]'}`}>
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">EN</span>
            <span className="text-[8px]">▼</span>
          </div>
          <Link
            to="/plan"
            className={`btn-accent !px-6 !py-3 !rounded-full shadow-none ${activeHeader ? '' : 'bg-white text-primary hover:bg-white hover:text-primary'}`}
          >
            Get Free Itinerary
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
            className="fixed inset-0 bg-[#FAFAFA] z-[120] lg:hidden flex flex-col p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] h-[100dvh] w-screen overflow-y-auto"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg sm:text-xl font-heading font-medium text-primary hover:text-accent transition-colors py-2.5 border-b border-primary/5"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/plan" className="btn-accent w-full text-xs py-3">Get Free Itinerary</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header