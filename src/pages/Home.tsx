import { motion } from "framer-motion"
import Hero from "../components/hero/Hero"
import DestinationCard from "../components/destinations/DestinationCard"
import Testimonials from "../components/sections/Testimonials"
import { ArrowRight, Compass, ShieldCheck, Heart, Headphones, Instagram } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"

const popularDestinations = [
  { id: 2, name: "Paro", image: "/paro-taksang.jpg", location: "Paro", price: "$150", rating: 4.9 },
  { id: 4, name: "Thimphu", image: "/thimphu.jpg", location: "Thimphu", price: "$110", rating: 4.6 },
  { id: 1, name: "Punakha", image: "/punakha-dzong.jpg", location: "Punakha", price: "$120", rating: 4.8 },
  { id: 6, name: "Bumthang", image: "/airport.jpg", location: "Bumthang", price: "$140", rating: 4.9 },
  { id: 5, name: "Phobjikha", image: "/monk.jpg", location: "Wangdue Phodrang", price: "$130", rating: 4.8 },
]

const topTours = [
  {
    id: "bhutan-highlights",
    title: "4 Days Bhutan Highlights",
    duration: "4 Days",
    price: "$999",
    image: "/paro-taksang.jpg",
    desc: "A brief but immersive escape covering Tiger's Nest and Thimphu's key attractions."
  },
  {
    id: "cultural-journey",
    title: "7 Days Cultural Journey",
    duration: "7 Days",
    price: "$1,699",
    image: "/punakha-dzong.jpg",
    desc: "Unveil the cultural heritage, majestic dzongs, and scenic passes across three valleys."
  },
  {
    id: "adventure-bhutan",
    title: "10 Days Adventure Bhutan",
    duration: "10 Days",
    price: "$2,499",
    image: "/dochula-pass.jpg",
    desc: "A combination of standard sightseeing, pristine day hikes, and local river rafting."
  },
  {
    id: "luxury-escape",
    title: "Luxury Bhutan Escape",
    duration: "6 Days",
    price: "$3,299",
    image: "/monk.jpg",
    desc: "Indulge in five-star luxury accommodations with private transfers and wellness treatments."
  }
]

const whyChooseUs = [
  { icon: Compass, label: "Local Guides", detail: "Our certified Bhutanese guides share the deep oral histories and sacred traditions of our ancestors." },
  { icon: ShieldCheck, label: "Best Price Guarantee", detail: "Enjoy direct local rates with transparent all-inclusive package pricing and SDF tax management." },
  { icon: Heart, label: "Handcrafted Tours", detail: "Every itinerary is tailored entirely to your interests, speed, travel style, and comfort." },
  { icon: Headphones, label: "24/7 Support", detail: "Our support operations are stationed directly in Thimphu to manage real-time updates and logistics." }
]

const instagramPhotos = [
  "/paro-taksang.jpg",
  "/punakha-dzong.jpg",
  "/dochula-pass.jpg",
  "/thimphu.jpg",
  "/monk.jpg",
  "/airport.jpg"
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="bg-bg-light overflow-x-hidden">
        {/* Section 1: Hero Banner */}
        <Hero />

        {/* Section 2: Popular Destinations */}
        <section className="section-padding px-6 max-w-[1440px] mx-auto mt-28 md:mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-2 gap-6"
          >
            <div className="max-w-2xl">
              <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 block">Where to Explore</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-primary tracking-tight font-medium">Popular Destinations</h2>
              <p className="text-secondary mt-4 font-light text-base md:text-lg tracking-wide leading-relaxed">
                Step into the kingdom's most legendary valleys. From towering clifftop temples to pristine glacial landscapes.
              </p>
            </div>
            <Link
              to="/destinations"
              className="group flex items-center space-x-3 text-primary uppercase tracking-[0.15em] text-xs font-semibold hover:text-accent transition-all pb-2 border-b border-primary/20 hover:border-accent shrink-0 self-start md:self-auto"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {popularDestinations.map((dest) => (
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
          </motion.div>
        </section>

        {/* Section 3: Top Tours */}
        <section className="section-padding bg-bg-alt py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
            >
              <div className="max-w-2xl">
                <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 block">Signature Itineraries</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-primary tracking-tight font-medium">Top Tours</h2>
                <p className="text-secondary mt-4 font-light text-base md:text-lg tracking-wide leading-relaxed">
                  Carefully designed itineraries balanced with culture, comfort, and local discovery.
                </p>
              </div>
              <Link
                to="/tours"
                className="group flex items-center space-x-3 text-primary uppercase tracking-[0.15em] text-xs font-semibold hover:text-accent transition-all pb-2 border-b border-primary/20 hover:border-accent shrink-0 self-start md:self-auto"
              >
                <span>View All Tours</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {topTours.map((tour, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
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
                    <h3 className="text-xl font-heading font-medium text-primary leading-tight mb-3 group-hover:text-accent transition-colors">{tour.title}</h3>
                    <p className="text-secondary font-light text-sm mb-6 leading-relaxed flex-1">{tour.desc}</p>
                    
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
          </div>
        </section>

        {/* Section 4: Why Choose Us */}
        <section className="section-padding py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 block">The Help Tourism Bhutan Way</span>
              <h2 className="text-3xl md:text-5xl text-primary font-heading font-medium leading-tight">Why Choose Us</h2>
              <p className="text-secondary max-w-2xl mx-auto mt-4 font-light text-base md:text-lg tracking-wide leading-relaxed">
                We craft moments, not just schedules. Discover how our localized experience changes your journey.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {whyChooseUs.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-8 bg-[#FAFAFA] rounded-[2rem] hover:shadow-premium hover:bg-white transition-all duration-300 border border-primary/5"
                >
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-body font-semibold text-primary mb-3 tracking-[0.08em] uppercase">{item.label}</h4>
                  <p className="text-secondary text-sm leading-relaxed font-light">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Customer Reviews */}
        <Testimonials />

        {/* Section 6: Instagram Gallery */}
        <section className="section-padding bg-bg-alt py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4">
                <Instagram className="w-3.5 h-3.5" />
                <span>Our Live Feed</span>
              </div>
              <h2 className="text-3xl md:text-5xl text-primary font-heading font-medium leading-tight">Traveler Moments</h2>
              <p className="text-secondary max-w-2xl mx-auto mt-4 font-light text-base md:text-lg tracking-wide leading-relaxed">
                Photos shared by our guests while journeying through the valleys of Bhutan.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {instagramPhotos.map((photo, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="relative aspect-square rounded-2xl overflow-hidden group shadow-minimal border border-primary/5"
                >
                  <img src={photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Instagram Guest Photo ${index + 1}`} />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Bottom Homepage CTA Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white text-primary border border-primary/5 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-minimal"
          >
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-heading font-medium mb-6 leading-tight">Ready for Your Bhutan Adventure?</h2>
              <p className="text-secondary text-lg mb-10 font-light max-w-xl leading-relaxed">
                Let our local experts create a personalized itinerary for you.
              </p>
              <Link to="/booking" className="btn-accent !px-10 !py-4 text-base font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
                Start Planning
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  )
}

export default Home