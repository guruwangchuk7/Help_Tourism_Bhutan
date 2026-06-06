import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'

type Hotel = {
  id: number
  name: string
  location: string
  image: string
  rating: number
  price: string
  desc?: string
  description?: string
}

const Hotels = () => {
  const navigate = useNavigate()
  const [luxuryHotels, setLuxuryHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/hotels`)
      .then(res => res.json())
      .then(data => {
        setLuxuryHotels(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh] overflow-x-hidden">
        {/* Full Image Hero Banner */}
        <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-visible">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/paro-taksang.jpg"
              className="w-full h-full object-cover"
              alt="Bhutan Luxury Hotels"
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
              Luxury <span className="text-accent italic font-normal">Hotels</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-xs md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              Experience the highest form of hospitality within the kingdom
            </motion.p>
          </div>
        </section>

        {/* Hotels Grid */}
        <main className="max-w-7xl mx-auto px-6 py-20">
          {loading ? (
            <div className="py-40 text-center">
              <p className="text-2xl font-heading italic text-gray-400 animate-pulse">Loading Luxury Partner Hotels...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              {luxuryHotels.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-minimal hover:shadow-premium group border border-primary/5 p-6 flex flex-col md:flex-row gap-6 transition-all duration-300"
                >
                  <div className="w-full md:w-56 h-56 rounded-3xl overflow-hidden shrink-0 relative">
                    <img src={hotel.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={hotel.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-accent">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider">{hotel.location}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-bg-light px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 text-accent fill-accent" />
                          <span className="text-xs font-bold text-primary">{hotel.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-heading font-medium text-primary leading-tight mb-3 group-hover:text-accent transition-colors">{hotel.name}</h3>
                      <p className="text-secondary font-light text-sm leading-relaxed mb-6">{hotel.desc || hotel.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-semibold text-rose-500 uppercase tracking-wider mb-0.5">Excludes $100/night government SDF</span>
                        <span className="text-xl font-heading font-semibold text-primary">{hotel.price} <span className="text-xs font-normal text-secondary">/ night</span></span>
                      </div>
                      <button
                        onClick={() => navigate('/booking', {
                          state: {
                            destinationName: hotel.name,
                            image: hotel.image,
                            totalPrice: parseFloat(hotel.price.replace(/[^0-9.]/g, '')) || 1800,
                            nights: 1,
                            adults: 2,
                            type: 'hotel'
                          }
                        })}
                        className="btn-accent !px-6 !py-2.5 !text-[10px] !rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <span>Inquire Stays</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  )
}

export default Hotels
