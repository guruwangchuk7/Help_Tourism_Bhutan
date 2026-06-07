import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"
import SEO from "../components/common/SEO"

type Tour = {
  id: string
  title: string
  duration: string
  price: string
  image: string
  desc: string
  difficulty: string
  category: string
}

const Tours = () => {
  const navigate = useNavigate()
  const [tours, setTours] = useState<Tour[]>([])
  const [toursLoading, setToursLoading] = useState(true)

  useEffect(() => {
    // Fetch all standard tours
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/tours`)
      .then(res => res.json())
      .then(data => {
        setTours(data)
        setToursLoading(false)
      })
      .catch(err => {
        console.error(err)
        setToursLoading(false)
      })
  }, [])

  const seoSchema = useMemo(() => {
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
            "name": "Tours",
            "item": "https://www.helptourbhutan.com/tours"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Bhutan Tour Packages & Expeditions",
        "numberOfItems": tours.length,
        "itemListElement": tours.map((tour, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": tour.title,
          "url": `https://www.helptourbhutan.com/tours/${tour.id}`
        }))
      }
    ]
  }, [tours])

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh] overflow-x-hidden">
        <SEO
          title="Curated Bhutan Tour Packages & Holiday Itineraries | Help Tourism"
          description="Explore top Bhutan tour packages designed by local travel agents. From 4-day highlights to cultural journeys, adventure trekking tours, and luxury getaways."
          keywords="Bhutan tour packages, Bhutan holiday packages, Bhutan private tours, Bhutan guided tours, Bhutan customized tours, best tour operator in Bhutan, affordable Bhutan tours"
          schema={seoSchema}
        />
        {/* Full Image Hero Banner */}
        <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-visible">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/paro-taksang.jpg"
              className="w-full h-full object-cover"
              alt="Bhutan Bespoke Tours"
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
              Bespoke <span className="text-accent italic font-normal">Journeys</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-[10px] md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              All Tour Packages
            </motion.p>
          </div>
        </section>

        {/* All Itineraries Section */}
        <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center md:text-left"
          >
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 block">Bespoke Journeys</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-primary tracking-tight font-medium">All Tour Packages</h2>
            <p className="text-secondary mt-4 font-light text-base md:text-lg tracking-wide leading-relaxed max-w-2xl">
              Discover our comprehensive selection of cultural festival tours, high altitude treks, and wellness escapes.
            </p>
          </motion.div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-6 h-96 animate-pulse border border-primary/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tours.map((tour, idx) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (idx % 3) * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/tours/${tour.id}`)}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-minimal hover:shadow-premium group border border-primary/5 p-5 flex flex-col transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shrink-0">
                    <img src={tour.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={tour.title} />
                    <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {tour.duration}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 pt-6 px-2">
                    <span className="text-[9px] font-semibold text-accent uppercase tracking-widest block mb-2">{tour.category} • {tour.difficulty}</span>
                    <h3 className="text-xl font-heading font-medium text-primary leading-tight mb-3 group-hover:text-accent transition-colors">{tour.title}</h3>
                    <p className="text-secondary font-light text-sm mb-6 leading-relaxed flex-1 line-clamp-3">{tour.desc}</p>

                    <div className="flex items-center justify-between pt-5 border-t border-primary/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-semibold text-secondary/60 uppercase tracking-wider mb-0.5">Price starting</span>
                        <span className="text-lg font-heading font-semibold text-primary">{tour.price}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/tours/${tour.id}`); }}
                        className="btn-accent !px-5 !py-2.5 !text-[10px] !rounded-full font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Explore Tour
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default Tours