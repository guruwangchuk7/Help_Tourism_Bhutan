import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, User, Search, ChevronDown, Plus, Minus, Star, ShieldCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const [datesDropdownOpen, setDatesDropdownOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [adults, setAdults] = useState(2)
  const [rooms, setRooms] = useState(1)
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    const handleGlobalClick = () => {
      setLocationDropdownOpen(false)
      setDatesDropdownOpen(false)
      setGuestsDropdownOpen(false)
    }
    window.addEventListener("click", handleGlobalClick)
    return () => window.removeEventListener("click", handleGlobalClick)
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/destinations')
  }

  return (
    <section className="relative min-h-[95dvh] flex flex-col items-center justify-center overflow-visible">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/paro-taksang.jpg"
          className="w-full h-full object-cover"
          alt="High-quality travel panorama"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Hero Copy */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-32 pb-16 lg:pb-36">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-[1.1] font-medium"
        >
          Discover Bhutan <br className="hidden md:block" /> Like Never Before
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-white/80 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed tracking-[0.1em] uppercase mb-8"
        >
          Customized Tours, Luxury Stays, Cultural Experiences & Adventure Trips
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <button
            onClick={() => navigate('/booking')}
            className="btn-accent !px-8 !py-4 !rounded-full shadow-lg text-sm font-semibold tracking-wide"
          >
            Plan My Trip
          </button>
          <button
            onClick={() => navigate('/tours')}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/35 !px-8 !py-4 !rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm transition-all"
          >
            Explore Tours
          </button>
        </motion.div>

        {/* Sleek Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="flex flex-wrap justify-center items-center gap-4 mt-6 text-white/95 text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-minimal">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span>4.9/5 Guest Rating</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-minimal">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>TCB Licensed Operator</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-minimal">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>24/7 Thimphu Support</span>
          </div>
        </motion.div>
      </div>      {/* The Booking Search Card (Glassmorphism) */}
      <div className="lg:absolute lg:-bottom-16 relative bottom-auto left-0 w-full z-40 px-6 mt-6 lg:mt-0">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onSubmit={handleSearch}
          className="max-w-5xl mx-auto glass-panel p-4 md:p-6 lg:p-4 flex flex-col lg:flex-row items-stretch gap-3 lg:gap-2"
        >
          {/* Location Field */}
          <div 
            className="flex-1 flex flex-col px-6 py-4 bg-white/40 hover:bg-white/60 transition-colors rounded-2xl cursor-text relative"
            onClick={(e) => { e.stopPropagation(); setLocationDropdownOpen(true); }}
          >
            <label className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-1 opacity-70">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Location
            </label>
            <input
              type="text"
              placeholder="Where to next?"
              className="bg-transparent text-primary font-medium outline-none placeholder:text-primary w-full text-lg font-heading"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setLocationDropdownOpen(true); }}
              onFocus={() => setLocationDropdownOpen(true)}
            />

            {locationDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-premium border border-primary/5 p-2 z-50 flex flex-col max-h-60 overflow-y-auto text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-secondary/50 border-b border-primary/5">
                  Tourist Sites in Bhutan
                </div>
                {[
                  { name: "Paro Taktsang", desc: "Tiger's Nest, Paro" },
                  { name: "Punakha Dzong", desc: "Punakha Fortress" },
                  { name: "Dochula Pass", desc: "108 Chortens, Thimphu" },
                  { name: "Thimphu Valley", desc: "Capital City" },
                  { name: "Phobjikha Valley", desc: "Black-Necked Cranes Home" },
                  { name: "Bumthang Valley", desc: "Spiritual Heartland" },
                ]
                  .filter(place => 
                    place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    place.desc.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((place) => (
                    <button
                      key={place.name}
                      type="button"
                      onClick={() => {
                        setSearchQuery(place.name);
                        setLocationDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-bg-alt transition-colors rounded-xl flex flex-col cursor-pointer"
                    >
                      <span className="font-heading font-medium text-base text-primary">{place.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-secondary">{place.desc}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Check-in / Check-out */}
          <div 
            className="flex-1 flex flex-col px-6 py-4 bg-white/40 hover:bg-white/60 transition-colors rounded-2xl cursor-pointer relative animate-none"
            onClick={(e) => { e.stopPropagation(); setDatesDropdownOpen(!datesDropdownOpen); }}
          >
            <label className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-1 opacity-70">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              Dates
            </label>
            <div className="flex items-center justify-between text-primary font-medium text-lg font-heading mt-1">
              <span className="truncate pr-1">
                {startDate || endDate 
                  ? `${startDate ? formatDate(startDate) : 'Start'} — ${endDate ? formatDate(endDate) : 'End'}` 
                  : "Select Dates"
                }
              </span>
              <ChevronDown className="w-4 h-4 text-primary/50 flex-shrink-0" />
            </div>

            {datesDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-premium border border-primary/5 p-4 z-50 flex flex-col gap-4 text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-1 py-1 text-[9px] font-bold uppercase tracking-widest text-secondary/50 border-b border-primary/5">
                  Select Duration
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Start Date</span>
                  <input
                    type="date"
                    className="w-full bg-bg-alt border border-primary/5 rounded-xl px-4 py-3 outline-none font-medium text-sm text-primary cursor-pointer"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">End Date</span>
                  <input
                    type="date"
                    className="w-full bg-bg-alt border border-primary/5 rounded-xl px-4 py-3 outline-none font-medium text-sm text-primary cursor-pointer"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDatesDropdownOpen(false)}
                  className="btn-accent !py-2.5 !text-[10px] w-full mt-2"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Guests & Rooms */}
          <div 
            className="flex-1 flex flex-col px-6 py-4 bg-white/40 hover:bg-white/60 transition-colors rounded-2xl cursor-pointer relative"
            onClick={(e) => { e.stopPropagation(); setGuestsDropdownOpen(!guestsDropdownOpen); }}
          >
            <label className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-1 opacity-70">
              <User className="w-3.5 h-3.5 text-accent" />
              Guests
            </label>
            <div className="flex items-center justify-between text-primary font-medium text-lg font-heading mt-1">
              <span>{`${adults} Adults, ${rooms} Room${rooms > 1 ? 's' : ''}`}</span>
              <ChevronDown className="w-4 h-4 text-primary/50" />
            </div>

            {guestsDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-premium border border-primary/5 p-4 z-50 flex flex-col gap-4 text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { if (adults > 1) setAdults(adults - 1); }}
                      className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-heading font-medium text-lg min-w-[20px] text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Rooms</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { if (rooms > 1) setRooms(rooms - 1); }}
                      className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-heading font-medium text-lg min-w-[20px] text-center">{rooms}</span>
                    <button
                      type="button"
                      onClick={() => setRooms(rooms + 1)}
                      className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGuestsDropdownOpen(false)}
                  className="btn-accent !py-2.5 !text-[10px] w-full mt-2"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Search CTA */}
          <button className="btn-primary !rounded-2xl lg:!px-12 !py-5 md:!py-4 !text-sm lg:!w-auto w-full shadow-lg hover:shadow-xl mt-2 lg:mt-0 flex-shrink-0">
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </motion.form>
      </div>
    </section>
  )
}

export default Hero