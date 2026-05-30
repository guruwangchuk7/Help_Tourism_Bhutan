import { motion } from 'framer-motion'
import { Star, MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'

const luxuryHotels = [
  {
    id: 1,
    name: "Amankora Resort",
    location: "Paro, Thimphu, Punakha, Gangtey & Bumthang",
    image: "/paro-taksang.jpg",
    rating: 5.0,
    price: "$1,800",
    desc: "A series of five ultra-luxury lodges spread across the pristine valleys, offering quiet elegance and unparalleled cultural immersion."
  },
  {
    id: 2,
    name: "Six Senses Bhutan",
    location: "Thimphu, Punakha & Paro",
    image: "/punakha-dzong.jpg",
    rating: 4.9,
    price: "$1,600",
    desc: "Designed to reflect the simplicity and beauty of the heritage sites, celebrating wellness, luxury, and the breathtaking scenery of Bhutan."
  },
  {
    id: 3,
    name: "COMO Uma Paro",
    location: "Paro Valley",
    image: "/dochula-pass.jpg",
    rating: 4.8,
    price: "$950",
    desc: "Combining luxury with adventure, COMO Uma Paro features private villas, fine dining, and holistic Asian-inspired therapies at Como Shambhala."
  },
  {
    id: 4,
    name: "Zhiwa Ling Heritage",
    location: "Paro",
    image: "/monk.jpg",
    rating: 4.7,
    price: "$450",
    desc: "A stunning locally-owned luxury hotel crafted in classic Bhutanese architectural heritage with modern guest amenities."
  }
]

const Hotels = () => {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="pt-24 bg-bg-light min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
          <img
            src="/paro-taksang.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
            alt="Bhutan Luxury Hotels"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-light via-transparent to-black/25" />

          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-medium text-white tracking-tight">
              Luxury Hotels
            </h1>
          </div>
        </section>

        {/* Hotels Grid */}
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                    <p className="text-secondary font-light text-sm leading-relaxed mb-6">{hotel.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-semibold text-secondary/60 uppercase tracking-wider mb-0.5">Est. Rate</span>
                      <span className="text-xl font-heading font-semibold text-primary">{hotel.price} <span className="text-xs font-normal text-secondary">/ night</span></span>
                    </div>
                    <button
                      onClick={() => navigate('/booking')}
                      className="btn-accent !px-6 !py-2.5 !text-[10px] !rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>Inquire Stays</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

export default Hotels
