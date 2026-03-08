import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, Compass, FilterX, ArrowRight } from 'lucide-react'
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
      <div className="pt-24 bg-white min-h-screen">
        {/* Cinematic Header - Minimalist */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="/paro-taksang.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
            alt="Bhutan Archives"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />

          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full mb-6 border border-white/20"
            >
              <Compass className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Kingdom Inventory</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-heading font-bold text-white tracking-tighter mb-4"
            >
              The <span className="italic font-normal">Archives</span>
            </motion.h1>
          </div>
        </section>

        {/* Interface Bar - Clean & Minimal */}
        <div className="sticky top-20 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by valley or tradition..."
                className="w-full bg-gray-50 border-none rounded-xl pl-16 pr-8 py-5 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center space-x-3 px-8 py-5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex-1 md:flex-none ${showFilters ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary border border-gray-100 hover:border-primary'
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
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
                className="overflow-hidden bg-gray-50/50"
              >
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
                  <div>
                    <h4 className="font-bold text-primary uppercase tracking-widest text-[10px] mb-6">Experience Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterType(cat)}
                          className={`px-6 py-2 rounded-lg font-bold text-xs border transition-all ${filterType === cat ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-primary/20'
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
                      className="flex items-center space-x-2 text-gray-400 hover:text-accent font-bold uppercase tracking-widest text-[10px]"
                    >
                      <FilterX className="w-4 h-4" />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Main */}
        <main className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-16 border-b border-gray-100 pb-8">
            <div>
              <span className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Catalog</span>
              <h2 className="text-4xl font-heading font-bold text-primary tracking-tight">Available Paths</h2>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{filteredDestinations.length} Results Found</p>
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

          {/* Minimalist Pagination */}
          <div className="mt-32 flex justify-center">
            <button className="flex items-center space-x-4 group text-primary font-bold uppercase tracking-widest text-xs border border-gray-100 px-10 py-5 rounded-full hover:bg-primary hover:text-white transition-all">
              <span>Load More Journeys</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

export default Destinations