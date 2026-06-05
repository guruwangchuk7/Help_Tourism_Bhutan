import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Video, ArrowUpRight, Compass, Phone, Mail, MessageCircle, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-20 border-b border-gray-100">
          {/* Logo & Bio */}
          <div className="lg:col-span-3">
            <Link to="/" className="flex items-center space-x-3 group mb-6">
              <Compass className="w-8 h-8 text-accent transition-all duration-500 group-hover:rotate-45" />
              <span className="text-3xl font-heading font-semibold text-primary tracking-wide">Help Tourism Bhutan</span>
            </Link>
            <p className="text-secondary text-sm font-light leading-relaxed max-w-sm tracking-wide">
              Your gateway to authentic Bhutanese luxury. We curate experiences that connect you with the soul of the Dragon Kingdom.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Bhutan Tours', path: '/tours' },
                { name: 'Hotels', path: '/hotels' },
                { name: 'Flights', path: '/flights' },
                { name: 'Bhutan SDF Fee', path: '/sdf' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-secondary hover:text-accent transition-all text-sm font-light flex items-center group">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Destinations</h4>
            <ul className="space-y-3">
              {['Paro', 'Thimphu', 'Punakha', 'Bumthang', 'Phobjikha'].map(dest => (
                <li key={dest}>
                  <Link to="/destinations" className="text-secondary hover:text-accent transition-all text-sm font-light">
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Base */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Contact</h4>
            <ul className="space-y-3 text-sm font-light text-secondary">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>+975 2 334567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a href="mailto:explore@helptourismbhutan.bt" className="hover:text-accent transition-colors truncate">explore@helptourismbhutan.bt</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-accent shrink-0" />
                <span>+975 17 609800 (WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Thimphu, Bhutan</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Social Media</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Instagram', icon: Instagram },
                { name: 'Facebook', icon: Facebook },
                { name: 'YouTube', icon: Youtube },
                { name: 'TikTok', icon: Video }
              ].map(social => (
                <Link
                  key={social.name}
                  to="#"
                  className="flex items-center gap-2 text-secondary hover:text-accent transition-colors text-sm font-light"
                >
                  <social.icon className="w-4 h-4" />
                  <span>{social.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>


        {/* Minimalist Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-normal tracking-[0.2em] text-primary/40 gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>© {new Date().getFullYear()} Help Tourism Bhutan. All rights reserved.</p>
            <span className="hidden md:inline">|</span>
            <p className="text-secondary/60">Developed by KodaDev</p>
          </div>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <Link to="/faq" className="hover:text-accent transition-colors">Travel FAQs</Link>
            <Link to="/sdf" className="hover:text-accent transition-colors">Sustainability & SDF</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer