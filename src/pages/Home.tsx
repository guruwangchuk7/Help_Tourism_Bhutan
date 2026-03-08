import { motion } from "framer-motion"
import Hero from "../components/hero/Hero"
import DestinationCard from "../components/destinations/DestinationCard"
import { destinations } from "../data/destinations"
import FeaturedDeals from "../components/sections/FeaturedDeals"
import TravelCategories from "../components/sections/TravelCategories"
import Testimonials from "../components/sections/Testimonials"
import { ArrowRight, Wallet, CalendarX, Headset } from "lucide-react"
import { Link } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"

const Home = () => {
  return (
    <PageTransition>
      <div className="bg-bg-light overflow-x-hidden">
        <Hero />

        {/* Featured/Trending Destinations Section */}
        <section className="section-padding px-6 max-w-[1440px] mx-auto mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-2 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-primary tracking-tight font-medium">Trending Destinations</h2>
              <p className="text-secondary mt-6 font-light text-lg tracking-wide leading-relaxed">Curated collections of the most sought-after stays and exquisite locales across the Kingdom.</p>
            </div>
            <Link
              to="/destinations"
              className="group flex items-center space-x-3 text-primary uppercase tracking-[0.15em] text-xs font-semibold hover:text-accent transition-all pb-2 border-b border-primary/20 hover:border-accent"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.slice(0, 4).map((dest) => (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                name={dest.name}
                image={dest.image}
                price={dest.price}
                rating={dest.rating}
                location={dest.location}
              />
            ))}
          </div>
        </section>

        {/* Value Proposition (Why Choose Us) */}
        <section className="section-padding bg-bg-alt mt-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl text-primary mb-6 tracking-tight font-heading font-medium leading-tight">The WanderVista Promise</h2>
              <p className="text-secondary max-w-2xl mx-auto font-light text-lg tracking-wide leading-relaxed">Elevate your travel experience with our dedicated support, exclusive access, and uncompromising guarantees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
              {[
                { icon: Wallet, label: "Best Price Guarantee", detail: "Find a lower price elsewhere and we'll match it plus give you an extra discount." },
                { icon: CalendarX, label: "Flexible Journeys", detail: "Change your plans without worry with our flexible booking and cancellation policies." },
                { icon: Headset, label: "24/7 Concierge", detail: "Our local experts are available around the clock to assist with any bespoke journey needs." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-10 bg-white rounded-3xl hover:shadow-premium transition-all duration-500 border border-primary/5"
                >
                  <div className="w-20 h-20 bg-bg-alt text-primary rounded-full flex items-center justify-center mb-8 border border-primary/5">
                    <item.icon className="w-8 h-8 opacity-80" />
                  </div>
                  <h4 className="text-lg font-body font-semibold text-primary mb-4 tracking-[0.1em] uppercase">{item.label}</h4>
                  <p className="text-secondary text-sm leading-loose font-light">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Sections Flow */}
        <div className="space-y-12 mb-32">
          <FeaturedDeals />
          <TravelCategories />
          <Testimonials />
        </div>

        {/* Newsletter Integrated into Design */}
        <section className="py-32 px-6 bg-primary text-white mx-4 md:mx-12 lg:mx-24 mb-32 overflow-hidden relative rounded-3xl">
          <div className="absolute inset-0 bg-[url('/paro-taksang.jpg')] opacity-20 bg-cover bg-center grayscale mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />

          <div className="max-w-3xl mx-auto text-center relative z-10 glass-panel !bg-primary/40 !border-white/10 p-10 md:p-16 rounded-[2rem]">
            <h2 className="text-3xl md:text-5xl font-heading font-medium mb-6">Join Our Insider Circle</h2>
            <p className="text-white/70 text-lg mb-10 font-light tracking-wide">Subscribe for exclusive travel guides, curated itineraries, and limited-time offers, sent straight to your inbox.</p>

            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/5 border border-white/20 rounded-full px-8 py-4 text-white placeholder-white/50 outline-none focus:bg-white/10 transition-all font-light"
              />
              <button
                className="btn-accent !px-10"
                onClick={(e) => { e.preventDefault(); alert('Subscribed!') }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default Home