import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, ArrowUpRight, Compass } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-gray-100">
          {/* Logo & Bio */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-3 group mb-8">
              <Compass className="w-8 h-8 text-accent transition-all duration-500 group-hover:rotate-45" />
              <span className="text-3xl font-heading font-semibold text-primary tracking-wide">WanderVista</span>
            </Link>
            <p className="text-secondary text-base font-light leading-loose max-w-sm mb-10 tracking-wide">
              Your gateway to authentic Bhutanese luxury. We curate experiences that connect you with the soul of the Dragon Kingdom.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Link key={i} to="#" className="w-12 h-12 rounded-full bg-bg-light flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-8">Company</h4>
            <ul className="space-y-4">
              {['Home', 'Stays', 'Flights', 'Packages'].map(link => (
                <li key={link}>
                  <Link to={`/${link === 'Home' ? '' : link.toLowerCase()}`} className="text-secondary hover:text-accent transition-all text-sm font-medium flex items-center group">
                    {link}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'FAQ', 'Privacy Policy', 'Terms of Service'].map(link => (
                <li key={link}>
                  <Link to="#" className="text-secondary hover:text-accent transition-all text-sm font-light tracking-wide">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-8">Contact Base</h4>
            <div className="space-y-4 text-sm font-light tracking-wide text-secondary">
              <p>Thimphu, Bhutan</p>
              <p className="text-accent underline underline-offset-8 decoration-accent/30 hover:decoration-accent transition-colors">explore@wandervista.bt</p>
              <p>+975 2 334567</p>
            </div>

            <div className="mt-12">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-6">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 bg-bg-light border border-primary/5 rounded-full px-5 py-3 text-sm font-light outline-none focus:border-accent/50 focus:bg-white transition-all"
                />
                <button className="bg-primary text-white px-6 py-3 rounded-full text-[10px] font-semibold uppercase tracking-widest hover:bg-accent transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/20">
          <p>© {new Date().getFullYear()} WanderVista Bhutan. All rights reserved.</p>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <Link to="#" className="hover:text-accent transition-colors">Safety Protocols</Link>
            <Link to="#" className="hover:text-accent transition-colors">Sustainability</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer