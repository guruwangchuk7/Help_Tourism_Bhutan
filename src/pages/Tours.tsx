import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, ArrowRight, CloudRain, Sun, Snowflake } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"

import { CardSkeleton } from "../components/common/Skeleton"

const iconMap: { [key: string]: any } = {
  Sun,
  CloudRain,
  Heart,
  Snowflake
}

type TourEdition = {
  id: number
  tour_id: string
  title: string
  period: string
  price: string
  image: string
  icon: string
}

const Tours = () => {
  const navigate = useNavigate()
  const [editions, setEditions] = useState<TourEdition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/tours/editions`)
      .then(res => res.json())
      .then(data => {
        setEditions(data)
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
              alt="Bhutan Signature Tours"
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
              Signature <span className="text-accent italic font-normal">Expeditions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-xs md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              Limited-entry tours designed around festivals, royal traditions, and seasonal peaks
            </motion.p>
          </div>
        </section>

        {/* Seasonal Tours Grid */}
        <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16"
            >
              {editions.map((tour, idx) => {
                const IconComponent = iconMap[tour.icon] || Sun;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -10 }}
                    onClick={() => navigate(`/tours/${tour.tour_id}`)}
                    className="bg-white rounded-[3rem] overflow-hidden shadow-minimal hover:shadow-premium group border border-primary/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center transition-all duration-500 cursor-pointer"
                  >
                <div className="w-full md:w-56 h-56 rounded-[2rem] overflow-hidden shrink-0 shadow-glass border border-primary/5">
                  <img src={tour.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="" />
                </div>
                <div className="flex-1 w-full">
                  <div className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-4 py-2 rounded-full mb-6">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] font-body">{tour.period}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-medium text-primary leading-tight mb-4 tracking-wide">{tour.title}</h3>
                  <p className="text-secondary font-light mb-8 leading-relaxed text-sm tracking-wide">Experience Bhutan in its peak glory with exclusive access to local festivals.</p>

                  <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-semibold text-accent uppercase tracking-[0.2em] mb-0.5">Includes $100/night SDF + Visa</span>
                      <span className="text-2xl font-heading font-semibold text-primary">{tour.price}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/tours/${tour.tour_id}`); }}
                      className="w-12 h-12 bg-bg-alt text-primary rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-minimal group-hover:shadow-lg cursor-pointer"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
          </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default Tours