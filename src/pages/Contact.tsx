import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send, Instagram, Twitter, Facebook, Globe } from "lucide-react"
import PageTransition from "../components/common/PageTransition"

type ContactData = {
  heroTitle: string
  heroSubtitle: string
  channelTitle: string
  channelSubtitle: string
  channelDesc: string
  baseTitle: string
  baseLine1: string
  baseLine2: string
  callTitle: string
  callLine1: string
  callLine2: string
  emailTitle: string
  emailLine1: string
  emailLine2: string
}

const Contact = () => {
  const [searchParams] = useSearchParams()
  const initialType = searchParams.get('type') === 'flight' ? 'Flight Booking Inquiry' : 'General Inquiry'
  const [inquiryType, setInquiryType] = useState(initialType)

  const [data, setData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return (
      <div className="p-40 text-center min-h-[100dvh] bg-bg-light text-2xl font-heading font-medium text-primary animate-pulse">
        Loading Contact Details...
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh] overflow-x-hidden">
        {/* Full Image Hero Banner */}
        <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-visible">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/thimphu.jpg"
              className="w-full h-full object-cover"
              alt="Thimphu capital city landscape"
            />
            <div className="absolute inset-0 bg-black/45 z-10" />
          </div>

          {/* Hero Copy */}
          <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-32 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-[1.1] font-medium"
            >
              {data.heroTitle.split(" ")[0]} <span className="text-accent italic font-normal">{data.heroTitle.split(" ").slice(1).join(" ")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-xs md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              {data.heroSubtitle}
            </motion.p>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-28 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
            {/* Contact Info (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-accent font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">{data.channelTitle}</span>
                <h2 className="text-2xl md:text-3xl font-heading font-medium text-primary tracking-tight mb-3">{data.channelSubtitle}</h2>
                <p className="text-secondary font-light text-sm sm:text-base leading-relaxed">
                  {data.channelDesc}
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: data.baseTitle,
                    lines: [data.baseLine1, data.baseLine2]
                  },
                  {
                    icon: Phone,
                    title: data.callTitle,
                    lines: [data.callLine1, data.callLine2]
                  },
                  {
                    icon: Mail,
                    title: data.emailTitle,
                    lines: [data.emailLine1, data.emailLine2]
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-primary/5 shadow-minimal hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-bg-alt flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-medium text-lg text-primary mb-1 tracking-wide">{item.title}</h4>
                      {item.lines.map((line, lIdx) => (
                        <p key={lIdx} className="text-secondary font-light text-xs sm:text-sm leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-6 border-t border-primary/10 flex space-x-3">
                {[
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Globe, label: "Globe" }
                ].map((item, idx) => (
                  <button key={idx} aria-label={item.label} className="w-10 h-10 rounded-xl bg-white border border-primary/5 flex items-center justify-center text-primary/60 hover:bg-accent hover:text-white hover:border-accent shadow-minimal hover:shadow-premium transition-all duration-300">
                    <item.Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-minimal border border-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-700 pointer-events-none" />
                <h3 className="text-2xl sm:text-3xl font-heading font-medium text-primary mb-2 tracking-tight">Initiate <span className="text-accent italic font-normal">Inquiry</span></h3>
                <p className="text-secondary font-light text-xs sm:text-sm tracking-wide mb-6">
                  Fill in your details below and a travel architect will respond within 12 hours.
                </p>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert('Message sent to Thimphu.') }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Full Name</label>
                      <input type="text" placeholder="e.g. Tenzin Dorji" className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary placeholder-secondary/40 text-xs sm:text-sm" required />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Email Address</label>
                      <input type="email" placeholder="e.g. tenzin@domain.com" className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary placeholder-secondary/40 text-xs sm:text-sm" required />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Inquiry Type</label>
                    <div className="relative">
                      <select 
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary text-xs sm:text-sm appearance-none cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Flight Booking Inquiry</option>
                        <option>Luxury Booking Request</option>
                        <option>Partnership Protocol</option>
                        <option>Cultural Sponsorship</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary/60">
                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Your Message</label>
                    <textarea placeholder="Describe your travel dreams, details, or questions..." rows={4} className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary placeholder-secondary/40 text-xs sm:text-sm resize-none" required></textarea>
                  </div>

                  <button className="btn-accent w-full py-3.5 text-[10px] font-bold tracking-widest rounded-xl shadow-premium mt-3">
                    Send Inquiry
                    <Send className="w-3.5 h-3.5 ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  )
}

export default Contact