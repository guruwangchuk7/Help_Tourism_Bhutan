import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ArrowLeft, Calendar, Users, Clock, MessageSquare, Heart, Share2, Star, Globe, ArrowRight, Wifi, Mountain, Bath, Car, Utensils, Sparkles, Minus, Plus } from "lucide-react"
import { destinations } from "../data/destinations"
import { useState, useEffect } from "react"
import PageTransition from "../components/common/PageTransition"

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const destination = destinations.find(d => d.id === Number(id))
  const [activeTab, setActiveTab] = useState('overview')
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [adults, setAdults] = useState(2)

  const calculateNights = () => {
    if (!startDate || !endDate) return 1
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }

  const nights = calculateNights()
  const priceNumber = destination ? Number(destination.price.replace(/[^0-9.-]+/g,"")) || 120 : 120
  const totalPrice = priceNumber * nights * adults

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
      <div className="bg-bg-light min-h-[100dvh]">
        {/* Immersive Header */}
        <div className="relative h-[80dvh] w-full overflow-hidden">
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
          <div className="absolute top-28 left-6 md:left-20 z-30">
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

          <div className="absolute bottom-12 md:bottom-20 left-6 md:left-20 right-6 md:right-20 z-30">
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
                  className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl text-white font-heading font-medium tracking-tight leading-tight md:leading-none"
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
                      <div key={item.day} className="group flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10 p-6 sm:p-8 md:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-minimal border border-primary/5 hover:shadow-premium transition-all duration-500 relative overflow-hidden">
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

                {activeTab === 'amenities' && (
                  <motion.div
                    key="amenities"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {[
                      { icon: Sparkles, label: "Heritage Sanctuary", desc: "Private meditation room overlooking the valley with local incense." },
                      { icon: Wifi, label: "High-Speed Wi-Fi", desc: "Satellite internet connection throughout the premises for connectivity." },
                      { icon: Mountain, label: "Panoramic Terraces", desc: "Elevated viewing balconies with views of local Himalayan ridges." },
                      { icon: Bath, label: "Organic Spa & Baths", desc: "Traditional hot stone bath facilities using fresh mountain herbs." },
                      { icon: Car, label: "Bespoke Transfers", desc: "Assigned luxury SUV and driver for all localized tours and day trips." },
                      { icon: Utensils, label: "Artisanal Kitchen", desc: "In-house culinary experiences focusing on organic farm-to-table cuisine." }
                    ].map((amenity, idx) => (
                      <div key={idx} className="flex items-start space-x-6 p-6 bg-white rounded-[2rem] shadow-minimal border border-primary/5 hover:shadow-premium transition-shadow duration-500">
                        <div className="w-16 h-16 bg-bg-alt rounded-full flex items-center justify-center text-primary shrink-0 border border-primary/5">
                          <amenity.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-heading font-medium text-xl text-primary mb-2">{amenity.label}</h4>
                          <p className="text-secondary font-light text-sm leading-relaxed tracking-wide">{amenity.desc}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {[
                      { name: "Elena Rostova", date: "April 2026", rating: 5, avatar: "https://i.pravatar.cc/150?u=elena", text: "Beyond luxury. The silence here is healing. Watching the sunrise from the terrace with hot butter tea is an experience I will carry with me forever. The staff treated us like royalty." },
                      { name: "Marcus Thorne", date: "March 2026", rating: 5, avatar: "https://i.pravatar.cc/150?u=marcus", text: "Incredibly well organized. The local guides are extremely knowledgeable. We got access to temple corridors that are usually closed to the public. Fully worth the journey." }
                    ].map((review, idx) => (
                      <div key={idx} className="p-8 bg-white rounded-[2rem] shadow-minimal border border-primary/5 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover grayscale" />
                            <div>
                              <h5 className="font-heading font-semibold text-primary text-base">{review.name}</h5>
                              <span className="text-[10px] uppercase text-secondary/60 tracking-wider">{review.date}</span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
                          </div>
                        </div>
                        <p className="text-secondary font-light text-sm leading-relaxed tracking-wide italic">
                          "{review.text}"
                        </p>
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
              <div className="bg-primary rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-white shadow-premium relative overflow-hidden group">
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/5 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-end justify-between mb-8 pb-6 border-b border-white/10">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[9px] font-semibold uppercase tracking-[0.2em] mb-2">Total Stay Cost</span>
                      <span className="text-4xl font-heading font-semibold text-white leading-none tracking-tight">${totalPrice}</span>
                    </div>
                    <div className="text-right flex flex-col justify-end">
                      <span className="block font-medium text-[10px] uppercase tracking-widest text-white/80">{nights} Night{nights > 1 ? 's' : ''} / {adults} Guest{adults > 1 ? 's' : ''}</span>
                      <span className="text-white/40 text-[9px] italic mt-1 font-light">{destination.price} per night</span>
                    </div>
                  </div>

                  {/* Date Selectors */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-white/50 pl-1">Check In</label>
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white/30 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-bold uppercase tracking-wider text-white/50 pl-1">Check Out</label>
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-white/30 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Travelers Selector */}
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-white">Travelers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => { if (adults > 1) setAdults(adults - 1); }}
                        className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 text-xs transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-semibold text-sm text-white min-w-[12px] text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 text-xs transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/booking', { state: { adults, nights, startDate, endDate, destinationName: destination.name, totalPrice } })}
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