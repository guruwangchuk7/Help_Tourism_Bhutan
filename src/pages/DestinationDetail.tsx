import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ArrowLeft, Calendar, Users, Shield, Clock, MessageSquare, Heart, Share2, Star, Globe, ArrowRight } from "lucide-react"
import { destinations } from "../data/destinations"
import { useState, useEffect } from "react"
import PageTransition from "../components/common/PageTransition"

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const destination = destinations.find(d => d.id === Number(id))
  const [activeTab, setActiveTab] = useState('overview')

  // Smooth scroll to top on enter
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!destination) return <div className="p-20 text-center text-2xl font-heading font-medium text-primary">Destination missed. Back to Home?</div>

  const itinerary = [
    { day: "01", title: "Arrival in the Land of Thunder Dragon", detail: "Traditional welcome at Paro International Airport. Private luxury transfer to your valley-view suite. Welcome dinner with cultural performance." },
    { day: "02", title: "Sacred Monasteries & Hidden Arts", detail: "Early morning meditation session at Kyichu Lhakhang. Exclusive access to temple murals and traditional thangka painting workshop." },
    { day: "03", title: "Himalayan Ridge Expedition", detail: "A guided hike through rhododendron forests to a mountain monastery. High-altitude picnic with panoramic Himalayan peaks." },
    { day: "04", title: "Departure & Blessings", detail: "Morning prayer ceremony for safe travels. Final souvenir shopping at the local craft bazaar and transfer to Paro Airport." },
  ]

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-screen">
        {/* Immersive Header */}
        <div className="relative h-[80vh] w-full overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-primary/90" />

          {/* Navigation Overlays */}
          <div className="absolute top-32 left-10 md:left-20 z-30">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors duration-300 group"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[10px] uppercase tracking-[0.3em]">Return</span>
            </button>
          </div>

          <div className="absolute bottom-20 left-10 md:left-20 right-10 md:right-20 z-30">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4 text-gold mb-6"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.3em] shadow-lg">Rare Experience</div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
                  </div>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-8xl lg:text-9xl text-white font-heading font-medium tracking-tight leading-tight md:leading-none"
                >
                  {destination.name}
                </motion.h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-500 shadow-glass group">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-500 shadow-glass group">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8">
            {/* Custom Tabs */}
            <div className="flex space-x-6 md:space-x-12 border-b border-primary/5 mb-10 md:mb-16 overflow-x-auto scrollbar-hide pb-2">
              {['overview', 'itinerary', 'amenities', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={`pb-4 relative font-medium text-[10px] uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-secondary/50 hover:text-primary'
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-primary mb-10 tracking-tight leading-tight">Authentic Bhutanese <br className="hidden md:block" /> Journey <span className="text-accent italic font-normal">Overview</span></h2>
                    <p className="text-secondary font-light text-lg leading-relaxed mb-16 tracking-wide">
                      {destination.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { icon: MapPin, label: "Altitude", val: "2,300m" },
                        { icon: Clock, label: "Ideal Stay", val: "4-5 Days" },
                        { icon: Calendar, label: "Peak Period", val: "Spring/Fall" },
                        { icon: Globe, label: "Language", val: "Dzongkha" },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-minimal flex flex-col items-center text-center border border-primary/5 hover:shadow-premium transition-shadow duration-500 group">
                          <div className="w-12 h-12 rounded-full bg-bg-alt flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                            <item.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-secondary/60 mb-2">{item.label}</span>
                          <span className="font-heading font-semibold text-primary">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'itinerary' && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {itinerary.map((item) => (
                      <div key={item.day} className="group flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10 p-8 md:p-10 bg-white rounded-[2.5rem] shadow-minimal border border-primary/5 hover:shadow-premium transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-accent font-heading font-medium text-4xl italic leading-none">{item.day}</span>
                          <div className="hidden md:block w-[1px] h-full bg-primary/10 my-4" />
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-heading font-medium text-primary mb-3 flex items-center space-x-3 tracking-wide">
                            <span>{item.title}</span>
                          </h4>
                          <p className="text-secondary font-light text-sm leading-relaxed tracking-wide">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Dynamic Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Booking Widget */}
              <div className="bg-primary rounded-[3rem] p-10 text-white shadow-premium relative overflow-hidden group">
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/5 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-end justify-between mb-10 pb-8 border-b border-white/10">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[9px] font-semibold uppercase tracking-[0.2em] mb-2">Standard Rate</span>
                      <span className="text-5xl font-heading font-semibold text-white leading-none tracking-tight">$899</span>
                    </div>
                    <div className="text-right flex flex-col justify-end">
                      <span className="block font-medium text-[10px] uppercase tracking-widest text-white/80">Total / Pers.</span>
                      <span className="text-white/40 text-[10px] italic mt-1 font-light">Inclusive of SDF Tax</span>
                    </div>
                  </div>

                  <div className="space-y-5 mb-10">
                    <div className="flex items-center space-x-4 text-white/70">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-light text-sm tracking-wide">2 Adult Travelers</span>
                    </div>
                    <div className="flex items-center space-x-4 text-white/70">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-light text-sm tracking-wide">Premium Medical Insurance</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/booking')}
                    className="w-full btn-accent py-5 text-sm shadow-glass"
                  >
                    Secure Trip
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>

                  <p className="mt-8 text-center text-[9px] font-medium text-white/30 uppercase tracking-[0.2em]">
                    Instant Confirmation Required
                  </p>
                </div>
              </div>

              {/* Assistance Card */}
              <div className="bg-white rounded-[2rem] p-8 shadow-minimal border border-primary/5 flex items-center space-x-5 hover:shadow-premium transition-shadow duration-500 group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-bg-alt flex items-center justify-center text-primary shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                  <MessageSquare className="w-6 h-6 transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-lg text-primary leading-none mb-2 tracking-wide">Need Guidance?</h4>
                  <p className="text-secondary font-light text-xs tracking-wide">Talk to our concierge in Thimphu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default DestinationDetail