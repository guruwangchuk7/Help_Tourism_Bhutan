import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, FilterX } from 'lucide-react'
import { destinations } from '../data/destinations'
import DestinationCard from '../components/destinations/DestinationCard'
import PageTransition from '../components/common/PageTransition'

const Destinations = () => {
  const [filterType, setFilterType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['All', 'Adventure', 'Cultural', 'Luxury', 'Trekking', 'Spiritual']

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

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
              alt="Bhutan Destinations Archives"
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
              The <span className="text-accent italic font-normal">Archives</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-xs md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              Explore the legendary valleys and sacred pathways of the Himalayan kingdom
            </motion.p>
          </div>
        </section>

        {/* Results Main */}
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 border-b border-primary/5 pb-8 gap-4">
            <div>
              <span className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Catalog</span>
              <h2 className="text-4xl font-heading font-bold text-primary tracking-tight">Available Paths</h2>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{filteredDestinations.length} Results Found</p>
          </div>

          {/* Interface Bar - Clean, Compact & Minimal */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Filter by valley or tradition..."
                  className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-6 py-3 outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-sm text-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all flex-1 sm:flex-none cursor-pointer border ${
                    showFilters 
                      ? 'bg-primary border-primary text-white shadow-sm' 
                      : 'bg-white text-primary border-gray-200 hover:border-primary'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Animated Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50/50 rounded-lg border border-gray-100 mt-4"
                >
                  <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-primary uppercase tracking-widest text-[9px] mb-4">Experience Category</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setFilterType(cat)}
                            className={`px-4 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                              filterType === cat 
                                ? 'bg-primary border-primary text-white shadow-sm' 
                                : 'bg-white border-gray-200 text-gray-400 hover:border-primary/20'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        onClick={() => { setFilterType('All'); setSearchQuery(''); }}
                        className="flex items-center space-x-2 text-gray-400 hover:text-accent font-bold uppercase tracking-widest text-[9px] cursor-pointer"
                      >
                        <FilterX className="w-3.5 h-3.5" />
                        <span>Clear All Filters</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredDestinations.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <DestinationCard
                    id={dest.id}
                    name={dest.name}
                    image={dest.image}
                    price={dest.price}
                    rating={dest.rating}
                    location={dest.location}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <p className="text-2xl font-heading italic text-gray-300">No results found for your query.</p>
            </div>
          )}


        </main>
      </div>
    </PageTransition>
  )
}

export default Destinations