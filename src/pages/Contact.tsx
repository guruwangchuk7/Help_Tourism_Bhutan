import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, ChevronDown, Check } from "lucide-react"
import PageTransition from "../components/common/PageTransition"
import SEO from "../components/common/SEO"

import { Skeleton, FormSkeleton } from "../components/common/Skeleton"

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

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      alert("Please fill in all fields before sending.")
      return
    }
    const subject = `Inquiry: ${inquiryType}`
    const body = `Kuzu zangpo la!

I would like to make an inquiry.

📋 Details:
- Name: ${fullName}
- Email: ${email}
- Type: ${inquiryType}

Message:
${message}

Thank you!`
    const mailtoUrl = `mailto:helptourbhutancontact@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl, '_blank')
    alert('Opening Gmail composer with your inquiry...')
  }

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      alert("Please fill in all fields before sending.")
      return
    }
    const body = `Kuzu zangpo la!

📋 *New Inquiry:*
- *Name:* ${fullName}
- *Email:* ${email}
- *Type:* ${inquiryType}

*Message:*
${message}`
    const waUrl = `https://wa.me/97517934593?text=${encodeURIComponent(body)}`
    window.open(waUrl, '_blank')
    alert('Opening WhatsApp support with your inquiry...')
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/contact`)
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
      <div className="bg-bg-light min-h-[100dvh]">
        {/* Banner Skeleton */}
        <div className="relative min-h-[70dvh] bg-gray-200/50 flex flex-col items-center justify-center p-6 border-b border-primary/5">
          <Skeleton className="h-16 w-1/3 mb-4 rounded-xl" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        {/* Content Layout Skeleton */}
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <FormSkeleton />
          </div>
        </div>
      </div>
    )
  }

  const contactSchema = useMemo(() => {
    return [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.helptourbhutan.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact",
            "item": "https://www.helptourbhutan.com/contact"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Help Tourism Bhutan",
        "description": "Get in touch with our local travel architects in Thimphu to start planning your custom Bhutan itinerary.",
        "mainEntity": {
          "@type": "TravelAgency",
          "name": "Help Tourism Bhutan",
          "url": "https://www.helptourbhutan.com/",
          "telephone": "+975-17934593",
          "email": "helptourbhutancontact@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Changlam Square, 2nd Floor",
            "addressLocality": "Thimphu",
            "addressCountry": "BT"
          }
        }
      }
    ]
  }, [])

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh] overflow-x-hidden">
        <SEO
          title="Contact Us | Help Tourism Bhutan Travel Agency"
          description="Get in touch with our local travel experts in Thimphu. Contact us for custom tour bookings, flight reservations, and personalized itinerary planning."
          keywords="Contact Bhutan tour operator, contact Bhutan travel agency, Bhutan trip consultation, customize Bhutan travel, Help Tourism Bhutan contact"
          ogImage="/thimphu.jpg"
          schema={contactSchema}
        />
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
              className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-[1.1] font-medium"
            >
              {data.heroTitle.split(" ")[0]} <span className="text-accent italic font-normal">{data.heroTitle.split(" ").slice(1).join(" ")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-[10px] md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              {data.heroSubtitle}
            </motion.p>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-28 pb-20 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
            {/* Contact Info (5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 space-y-8"
            >
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
                    lines: [data.callLine1, data.callLine2].filter((val, idx, arr) => val && arr.indexOf(val) === idx)
                  },
                  {
                    icon: Mail,
                    title: data.emailTitle,
                    lines: [data.emailLine1, data.emailLine2].filter((val, idx, arr) => val && arr.indexOf(val) === idx)
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


            </motion.div>

            {/* Contact Form (7 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-minimal border border-primary/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-700 pointer-events-none" />
                <h3 className="text-2xl sm:text-3xl font-heading font-medium text-primary mb-2 tracking-tight">Initiate <span className="text-accent italic font-normal">Inquiry</span></h3>
                <p className="text-secondary font-light text-xs sm:text-sm tracking-wide mb-6">
                  Fill in your details below and a travel architect will respond within 12 hours.
                </p>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Tenzin Dorji" 
                        className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary placeholder-secondary/40 text-xs sm:text-sm" 
                        required 
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. tenzin@domain.com" 
                        className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary placeholder-secondary/40 text-xs sm:text-sm" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5 relative">
                    <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Inquiry Type</label>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary text-xs sm:text-sm flex items-center justify-between cursor-pointer text-left"
                    >
                      <span>{inquiryType}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-secondary/60 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-primary/5 rounded-xl shadow-premium z-50 overflow-hidden text-xs sm:text-sm text-primary">
                          {[
                            "General Inquiry",
                            "Flight Booking Inquiry",
                            "Luxury Booking Request",
                            "Partnership Protocol",
                            "Cultural Sponsorship"
                          ].map((option) => (
                            <div
                              key={option}
                              onClick={() => {
                                setInquiryType(option)
                                setDropdownOpen(false)
                              }}
                              className={`px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-bg-alt flex items-center justify-between ${
                                inquiryType === option ? 'bg-accent/5 text-accent font-medium' : 'text-primary font-light'
                              }`}
                            >
                              <span>{option}</span>
                              {inquiryType === option && <Check className="w-3.5 h-3.5 text-accent" />}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] font-medium text-secondary uppercase tracking-[0.2em] pl-1">Your Message</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your travel dreams, details, or questions..." 
                      rows={4} 
                      className="w-full bg-bg-light border border-primary/5 rounded-xl px-4 py-3 outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10 transition-all font-light text-primary placeholder-secondary/40 text-xs sm:text-sm resize-none" 
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <button 
                      type="button"
                      onClick={handleGmailSubmit}
                      className="btn-accent w-full py-3.5 text-[10px] font-bold tracking-widest rounded-xl shadow-premium flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send via Gmail</span>
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button"
                      onClick={handleWhatsAppSubmit}
                      className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold tracking-widest rounded-xl shadow-premium flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer"
                    >
                      <span>Send via WhatsApp</span>
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.592 1.97 14.121.948 11.5.948c-5.442 0-9.867 4.372-9.87 9.802 0 1.698.48 3.35 1.387 4.814l-.993 3.627 3.733-.979zm11.391-7.228c-.286-.143-1.692-.825-1.953-.919-.26-.094-.45-.141-.639.143-.19.283-.733.919-.899 1.109-.166.19-.332.213-.618.071-.286-.143-1.206-.438-2.298-1.396-.85-.749-1.424-1.673-1.591-1.958-.167-.285-.018-.439.124-.581.128-.127.286-.33.429-.496.143-.165.19-.283.286-.472.095-.19.047-.354-.024-.496-.071-.142-.639-1.518-.876-2.085-.23-.553-.465-.478-.639-.487-.165-.008-.355-.01-.545-.01-.19 0-.5.07-.762.354-.262.283-1 .953-1 2.325 0 1.372 1.011 2.697 1.153 2.886.142.188 1.99 2.997 4.819 4.195.673.286 1.2.457 1.609.585.677.211 1.293.181 1.779.11.542-.08 1.692-.682 1.93-.941.237-.26.237-.482.166-.624-.071-.142-.285-.226-.571-.368z"/>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </PageTransition>
  )
}

export default Contact