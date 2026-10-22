import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Hero from "../components/hero/Hero"
import DestinationCard from "../components/destinations/DestinationCard"
import { ArrowRight, Compass, ShieldCheck, Heart, Headphones, Instagram } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"
import SEO from "../components/common/SEO"
import { CardSkeleton } from "../components/common/Skeleton"

const fallbackDestinations = [
  { id: 2, name: "Paro", image: "/paro-taksang.jpg", location: "Paro", price: "$150" },
  { id: 4, name: "Thimphu", image: "/thimphu.jpg", location: "Thimphu", price: "$110" },
  { id: 1, name: "Punakha", image: "/punakha-dzong.jpg", location: "Punakha", price: "$120" },
  { id: 6, name: "Bumthang", image: "/airport.jpg", location: "Bumthang", price: "$140" },
  { id: 5, name: "Phobjikha", image: "/monk.jpg", location: "Wangdue Phodrang", price: "$130" },
]

const getShortName = (id: number, fullName: string) => {
  switch(id) {
    case 1: return "Punakha";
    case 2: return "Paro";
    case 4: return "Thimphu";
    case 5: return "Phobjikha";
    case 6: return "Bumthang";
    default: return fullName;
  }
}

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

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://www.helptourbhutan.com/#travelagency",
    "name": "Help Tourism Bhutan",
    "url": "https://www.helptourbhutan.com/",
    "logo": "https://www.helptourbhutan.com/favicon.svg",
    "image": "https://www.helptourbhutan.com/paro-taksang.jpg",
    "description": "Premium local tour operator and travel agency in Bhutan. Specializing in bespoke private tours, Himalayan trekking adventures, luxury vacations, and cultural festival packages.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chang Lam",
      "addressLocality": "Thimphu",
      "postalCode": "11001",
      "addressCountry": "BT"
    },
    "telephone": "+975-2-321111",
    "priceRange": "$$$",
    "sameAs": [
      "https://www.facebook.com/helptourismbhutan",
      "https://www.instagram.com/helptourismbhutan"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.helptourbhutan.com/#website",
    "name": "Help Tourism Bhutan",
    "url": "https://www.helptourbhutan.com/"
  }
]

type HomeDestination = {
  id: number
  name: string
  image: string
  location: string
  price: string
  rating?: number
}

const Home = () => {
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState<HomeDestination[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDestIndex, setActiveDestIndex] = useState(0)
  const [activeTourIndex, setActiveTourIndex] = useState(0)

  const handleDestScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollLeft = container.scrollLeft
    const card = container.querySelector('[data-card="dest"]')
    if (card) {
      const cardWidth = card.clientWidth
      const gap = 16 // gap-4 is 16px
      const index = Math.round(scrollLeft / (cardWidth + gap))
      const safeIndex = Math.max(0, Math.min(index, destinations.length - 1))
      if (safeIndex !== activeDestIndex) {
        setActiveDestIndex(safeIndex)
      }
    }
  }

  const handleTourScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollLeft = container.scrollLeft
    const card = container.querySelector('[data-card="tour"]')
    if (card) {
      const cardWidth = card.clientWidth
      const gap = 16 // gap-4 is 16px
      const index = Math.round(scrollLeft / (cardWidth + gap))
      const safeIndex = Math.max(0, Math.min(index, topTours.length - 1))
      if (safeIndex !== activeTourIndex) {
        setActiveTourIndex(safeIndex)
      }
    }
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/destinations?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const targetIds = [2, 4, 1, 6, 5];
          const sorted = data
            .filter((d: HomeDestination) => targetIds.includes(d.id))
            .sort((a: HomeDestination, b: HomeDestination) => targetIds.indexOf(a.id) - targetIds.indexOf(b.id))
            .map((d: HomeDestination) => ({
              ...d,
              name: getShortName(d.id, d.name)
            }));
          setDestinations(sorted);
        } else {
          setDestinations(fallbackDestinations)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch destinations for homepage:", err)
        setDestinations(fallbackDestinations)
        setLoading(false)
      })
  }, [])

  return (
    <PageTransition>
      <div className="bg-bg-light overflow-x-hidden">
        <SEO
          title="Best Bhutan Tour Operator & Travel Agency | Help Tourism Bhutan"
          description="Plan your dream Himalayan holiday with Help Tourism Bhutan, the premier local travel agency in Bhutan. Book luxury private tours, custom cultural festival packages, and scenic trekking adventures."
          keywords="Bhutan tour operator, Bhutan travel agency, Bhutan tour packages, Bhutan holiday packages, Bhutan private tours, Bhutan customized tours, Bhutan guided tours, best tour operator in Bhutan, best travel agency in Bhutan, Bhutan sustainable tourism"
          schema={homeSchema}
        />
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

          {loading ? (
            <>
              {/* Desktop view */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
              {/* Mobile view */}
              <div className="flex md:hidden overflow-x-auto no-scrollbar gap-4 px-[15vw] pb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-[70vw] shrink-0 opacity-60">
                    <CardSkeleton />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Mobile View: Swipe Carousel (< 768px) */}
              <div className="block md:hidden">
                <div
                  onScroll={handleDestScroll}
                  className="flex items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 px-[15vw] pb-4"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  role="region"
                  aria-label="Popular Destinations Carousel"
                >
                  {destinations.map((dest, idx) => {
                    const isActive = idx === activeDestIndex;
                    return (
                      <div
                        data-card="dest"
                        key={dest.id}
                        className={`w-[70vw] shrink-0 snap-center flex flex-col transition-all duration-500 ease-out transform ${
                          isActive ? "scale-100 opacity-100" : "scale-[0.93] opacity-65"
                        }`}
                      >
                        <DestinationCard
                          id={dest.id}
                          name={dest.name}
                          image={dest.image}
                          price={dest.price}
                          location={dest.location}
                          rating={dest.rating}
                          showPrice={false}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* Pagination Indicator */}
                <div className="flex items-center justify-center space-x-3.5 mt-6">
                  <span className="text-[11px] font-bold text-primary/70 tracking-widest font-body">
                    {activeDestIndex + 1} / {destinations.length}
                  </span>
                  <div className="h-3.5 w-[1px] bg-primary/10" />
                  <div className="flex gap-1.5">
                    {destinations.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === activeDestIndex ? "w-5 bg-accent" : "w-1 bg-primary/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop View: Grid (>= 768px) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
              >
                {destinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    id={dest.id}
                    name={dest.name}
                    image={dest.image}
                    price={dest.price}
                    location={dest.location}
                    rating={dest.rating}
                    showPrice={false}
                  />
                ))}
              </motion.div>
            </>
          )}
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

            {/* Mobile View: Swipe Carousel (< 768px) */}
            <div className="block md:hidden">
              <div
                onScroll={handleTourScroll}
                className="flex items-stretch overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 px-[7.5vw] pb-4"
                style={{ WebkitOverflowScrolling: "touch" }}
                role="region"
                aria-label="Top Tours Carousel"
              >
                {topTours.map((tour, idx) => {
                  const isActive = idx === activeTourIndex;
                  return (
                    <div
                      data-card="tour"
                      key={idx}
                      className={`w-[85vw] shrink-0 snap-center flex flex-col transition-all duration-500 ease-out transform ${
                        isActive ? "scale-100 opacity-100" : "scale-[0.95] opacity-70"
                      }`}
                      onClick={() => navigate(`/tours/${tour.id}`)}
                    >
                      <div className="relative aspect-[16/10] min-h-[260px] rounded-3xl overflow-hidden shadow-minimal group cursor-pointer border border-white/10">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        {/* Frosted Bottom Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent backdrop-blur-[1px] pointer-events-none" />

                        {/* Text Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                          <h3 className="text-xl sm:text-2xl font-heading font-semibold text-white tracking-tight mb-2 group-hover:text-accent transition-colors leading-snug">
                            {tour.title}
                          </h3>
                          <p className="text-white/85 font-light text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {tour.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Pagination Indicator */}
              <div className="flex items-center justify-center space-x-3.5 mt-6">
                <span className="text-[11px] font-bold text-primary/70 tracking-widest font-body">
                  {activeTourIndex + 1} / {topTours.length}
                </span>
                <div className="h-3.5 w-[1px] bg-primary/10" />
                <div className="flex gap-1.5">
                  {topTours.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === activeTourIndex ? "w-5 bg-accent" : "w-1 bg-primary/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop View: 2x2 Grid (>= 768px) matching the reference */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {topTours.map((tour, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  onClick={() => navigate(`/tours/${tour.id}`)}
                  className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-minimal hover:shadow-premium group cursor-pointer transition-all duration-300 border border-black/5"
                >
                  {/* Full Bleed Photographic Image (No zoom animation) */}
                  <img
                    src={tour.image}
                    alt={tour.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />

                  {/* Frosted Bottom Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent backdrop-blur-[1px] pointer-events-none" />

                  {/* Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end">
                    <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-white tracking-tight mb-2 group-hover:text-accent transition-colors leading-snug">
                      {tour.title}
                    </h3>
                    <p className="text-white/85 font-light text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl">
                      {tour.desc}
                    </p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
              {whyChooseUs.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Minimal Soft Icon Badge */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-secondary text-sm font-light leading-relaxed max-w-xs mx-auto">
                    {item.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Instagram Gallery */}
        <section className="section-padding bg-bg-alt py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4">
                <Instagram className="w-3.5 h-3.5" />
                <span>Our Live Feed</span>
              </div>
              <h2 className="text-3xl md:text-5xl text-primary font-heading font-medium leading-tight">Traveler Moments</h2>
              <p className="text-secondary max-w-2xl mx-auto mt-4 font-light text-base md:text-lg tracking-wide leading-relaxed">
                Photos shared by our guests while journeying through the valleys of Bhutan.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {instagramPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-2xl overflow-hidden group shadow-minimal border border-primary/5"
                >
                  <img src={photo} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Instagram Guest Photo ${index + 1}`} />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Bottom Homepage CTA Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto mb-16">
          <div className="bg-white text-primary border border-primary/5 rounded-[3rem] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-minimal">
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-heading font-medium mb-6 leading-tight">Ready for Your Bhutan Adventure?</h2>
              <p className="text-secondary text-lg mb-10 font-light max-w-xl leading-relaxed">
                Let our local experts create a personalized itinerary for you.
              </p>
              <Link to="/booking" className="btn-accent !px-10 !py-4 text-base font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
                Start Planning
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default Home