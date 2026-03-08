import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send, Instagram, Twitter, Facebook, Globe } from "lucide-react"
import PageTransition from "../components/common/PageTransition"

const Contact = () => {
  return (
    <PageTransition>
      <div className="pt-24 bg-white min-h-screen border-t border-primary/5">
        {/* Visual Header */}
        <section className="py-24 px-6 relative overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none select-none overflow-hidden whitespace-nowrap">
            <span className="text-[250px] font-heading font-medium uppercase text-primary leading-none block">TALK TALK TALK</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-medium text-primary tracking-tight leading-none mb-6">Contact <span className="text-accent italic">Thimphu</span></h1>
            <p className="text-secondary font-light text-xl max-w-2xl mx-auto tracking-wide">Our local experts in the capital are ready to architect your dream journey.</p>
          </motion.div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Contact Info (5 cols) */}
            <div className="lg:col-span-5 space-y-12 mt-12">
              <div className="flex items-start space-x-8 group">
                <div className="w-16 h-16 bg-bg-alt rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:bg-accent group-hover:text-white group-hover:-translate-y-1 group-hover:shadow-lg">
                  <MapPin className="w-6 h-6 transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-2xl text-primary mb-2 tracking-wide">The Base</h4>
                  <p className="text-secondary font-light text-lg leading-relaxed tracking-wide">
                    Changlam Square, 2nd Floor <br />
                    Thimphu, Kingdom of Bhutan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-8 group">
                <div className="w-16 h-16 bg-bg-alt rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:bg-accent group-hover:text-white group-hover:-translate-y-1 group-hover:shadow-lg">
                  <Phone className="w-6 h-6 transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-2xl text-primary mb-2 tracking-wide">Digital Call</h4>
                  <p className="text-secondary font-light text-lg leading-relaxed tracking-wide">
                    +975 2 334567 <br />
                    +975 17 609800 (WhatsApp)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-8 group">
                <div className="w-16 h-16 bg-bg-alt rounded-2xl flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:bg-accent group-hover:text-white group-hover:-translate-y-1 group-hover:shadow-lg">
                  <Mail className="w-6 h-6 transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-2xl text-primary mb-2 tracking-wide">Electronic Mail</h4>
                  <p className="text-secondary font-light text-lg leading-relaxed tracking-wide">
                    explore@wandervista.bt <br />
                    concierge@wandervista.bt
                  </p>
                </div>
              </div>

              <div className="pt-10 border-t border-primary/5 flex space-x-4">
                {[Instagram, Twitter, Facebook, Globe].map((Icon, idx) => (
                  <button key={idx} className="w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-bg-light rounded-[3rem] p-10 md:p-16 shadow-minimal border border-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
                <h3 className="text-4xl font-heading font-medium text-primary mb-10 tracking-tight">Initiate <span className="text-accent italic font-normal">Inquiry</span></h3>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent to Thimphu.') }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Identity Name" className="w-full bg-white border border-primary/5 rounded-xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light placeholder-secondary/50" required />
                    <input type="email" placeholder="Digital Address" className="w-full bg-white border border-primary/5 rounded-xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light placeholder-secondary/50" required />
                  </div>
                  <select className="w-full bg-white border border-primary/5 rounded-xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light text-secondary appearance-none">
                    <option>General Enlightenment</option>
                    <option>Luxury Booking Request</option>
                    <option>Partnership Protocol</option>
                    <option>Cultural Sponsorship</option>
                  </select>
                  <textarea placeholder="Your Intentions..." rows={5} className="w-full bg-white border border-primary/5 rounded-xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light placeholder-secondary/50 resize-none" required></textarea>

                  <button className="btn-accent w-full py-5 text-sm shadow-premium mt-4">
                    Send Transmission
                    <Send className="w-4 h-4 ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <section className="h-[400px] w-full bg-white relative group overflow-hidden border-t border-primary/5">
          <img src="/thimphu.jpg" className="w-full h-full object-cover filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000" alt="Thimphu Map" />
          <div className="absolute inset-0 bg-primary/20 pointer-events-none group-hover:bg-transparent transition-colors duration-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-8 py-4 rounded-xl shadow-glass flex items-center space-x-4 border border-white/20">
            <div className="w-3 h-3 rounded-full bg-accent animate-ping" />
            <span className="font-semibold text-primary uppercase tracking-[0.2em] text-[10px]">Architectural Base In Thimphu</span>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default Contact