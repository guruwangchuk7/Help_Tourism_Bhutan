import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MessageSquare, Heart, Share2, ArrowRight, Wifi, Mountain, Bath, Car, Utensils, Sparkles } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import PageTransition from "../components/common/PageTransition"
import SEO from "../components/common/SEO"
import { DetailSkeleton } from "../components/common/Skeleton"

type Destination = {
  id: number
  name: string
  image: string
  description: string
  attractions: string[]
  price: string
  location: string
}

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [mountTime] = useState(() => Date.now())

  const cacheBustedImage = (destination && destination.image && typeof destination.image === 'string' && !destination.image.startsWith('data:') && !destination.image.includes('?t='))
    ? `${destination.image}${destination.image.includes('?') ? '&' : '?'}t=${mountTime}`
    : destination?.image || ''

  const seoSchema = useMemo(() => {
    if (!destination) return null
    let displayDescription = destination.description
    let displayAmenitiesNames = [
      "Heritage Sanctuary", "High-Speed Wi-Fi", "Panoramic Terraces", "Organic Spa & Baths", "Bespoke Transfers", "Artisanal Kitchen"
    ]
    try {
      if (destination.description.trim().startsWith('{')) {
        const parsed = JSON.parse(destination.description)
        if (parsed.text) displayDescription = parsed.text
        if (parsed.amenities && Array.isArray(parsed.amenities)) {
          displayAmenitiesNames = parsed.amenities.map((a: any) => a.label || "Amenity")
        }
      }
    } catch (e) {}

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
            "name": "Destinations",
            "item": "https://www.helptourbhutan.com/destinations"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": destination.name,
            "item": `https://www.helptourbhutan.com/destinations/${destination.id}`
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": destination.name,
        "description": displayDescription,
        "image": `https://www.helptourbhutan.com${destination.image}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": destination.location,
          "addressCountry": "BT"
        },
        "touristType": "Leisure, Cultural, Adventure",
        "amenityFeature": displayAmenitiesNames.map(name => ({
          "@type": "LocationFeatureSpecification",
          "name": name,
          "value": true
        }))
      }
    ]
  }, [destination])

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/destinations/${id}?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch")
        }
        return res.json()
      })
      .then(data => {
        setDestination(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }, [id])

  // Smooth scroll to top on enter
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <DetailSkeleton />
  if (error || !destination) {
    return (
      <PageTransition title="Destination Not Found | Help Tourism Bhutan" description="The requested Bhutan travel destination could not be found.">
        <div className="min-h-[100dvh] bg-bg-light flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
          <div className="max-w-md bg-white border border-primary/5 rounded-[2.5rem] p-8 sm:p-12 shadow-premium space-y-6">
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] block">Error 404</span>
            <h1 className="text-3xl font-heading font-medium text-primary">Destination Not Found</h1>
            <p className="text-secondary font-light text-sm leading-relaxed">
              We couldn't retrieve the details for this destination. It may have been relocated or is currently unavailable.
            </p>
            <button
              onClick={() => navigate('/destinations')}
              className="btn-accent px-8 py-3 rounded-full mt-4"
            >
              Browse Destinations
            </button>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Default values
  let displayDescription = destination.description;
  let displayItinerary = [
    { day: "01", title: "Arrival in the Land of Thunder Dragon", detail: "Traditional welcome at Paro International Airport. Private luxury transfer to your valley-view suite. Welcome dinner with cultural performance." },
    { day: "02", title: "Sacred Monasteries & Hidden Arts", detail: "Early morning meditation session at Kyichu Lhakhang. Exclusive access to temple murals and traditional thangka painting workshop." },
    { day: "03", title: "Himalayan Ridge Expedition", detail: "A guided hike through rhododendron forests to a mountain monastery. High-altitude picnic with panoramic Himalayan peaks." },
    { day: "04", title: "Departure & Blessings", detail: "Morning prayer ceremony for safe travels. Final souvenir shopping at the local craft bazaar and transfer to Paro Airport." },
  ];
  const iconMap: Record<string, any> = { Sparkles, Wifi, Mountain, Bath, Car, Utensils };
  let displayAmenities = [
    { icon: Sparkles, label: "Heritage Sanctuary", desc: "Private meditation room overlooking the valley with local incense." },
    { icon: Wifi, label: "High-Speed Wi-Fi", desc: "Satellite internet connection throughout the premises for connectivity." },
    { icon: Mountain, label: "Panoramic Terraces", desc: "Elevated viewing balconies with views of local Himalayan ridges." },
    { icon: Bath, label: "Organic Spa & Baths", desc: "Traditional hot stone bath facilities using fresh mountain herbs." },
    { icon: Car, label: "Bespoke Transfers", desc: "Assigned luxury SUV and driver for all localized tours and day trips." },
    { icon: Utensils, label: "Artisanal Kitchen", desc: "In-house culinary experiences focusing on organic farm-to-table cuisine." }
  ];
  try {
    if (destination.description.trim().startsWith('{')) {
      const parsed = JSON.parse(destination.description);
      if (parsed.text) displayDescription = parsed.text;
      if (parsed.itinerary && Array.isArray(parsed.itinerary)) {
        displayItinerary = parsed.itinerary;
      }
      if (parsed.amenities && Array.isArray(parsed.amenities)) {
        displayAmenities = parsed.amenities.map((a: any) => ({
          icon: iconMap[a.icon] || Sparkles,
          label: a.label || "Amenity",
          desc: a.desc || ""
        }));
      }
    }
  } catch (e) {
    // Fail silently, use defaults
  }

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh]">
        <SEO
          title={`${destination.name} Travel Guide | Things to Do & Sightseeing`}
          description={`Discover the magic of ${destination.name} in ${destination.location}. Learn about the best local attractions like ${destination.attractions.join(', ')}, find travel tips, and book custom guided tours.`}
          keywords={`${destination.name} travel guide, ${destination.name} attractions, ${destination.location} tour package, Bhutan sightseeing, best things to do in ${destination.location}`}
          ogImage={destination.image}
          schema={seoSchema || undefined}
        />
        {/* Immersive Header */}
        <div className="relative h-[80dvh] w-full overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            src={cacheBustedImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-primary/90" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-28 left-6 sm:left-12 z-20 flex items-center gap-2 text-white/80 hover:text-white bg-black/25 hover:bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Return</span>
          </button>

          <div className="absolute bottom-12 md:bottom-20 left-6 md:left-20 right-6 md:right-20 z-30">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 block"
                >
                  Rare Experience • {destination.location}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-5xl md:text-8xl lg:text-9xl text-white font-heading font-medium tracking-tight leading-tight md:leading-none"
                >
                  {destination.name}
                </motion.h1>
              </div>

              <div className="flex items-center space-x-4">
                <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-500 shadow-glass group">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all duration-500 shadow-glass group">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8">
            {/* Custom Tabs */}
            <div className="flex space-x-6 md:space-x-12 border-b border-primary/5 mb-10 md:mb-16 overflow-x-auto scrollbar-hide pb-2 relative">
              {['overview', 'itinerary', 'amenities'].map(tab => (
                <button
                  key={tab}
                  className={`pb-4 relative font-medium text-[10px] uppercase tracking-[0.2em] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded ${activeTab === tab ? 'text-primary' : 'text-secondary/50 hover:text-primary'
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none overflow-hidden">
                      <motion.div layoutId="tab-underline" className="w-full h-full bg-accent" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-primary mb-10 tracking-tight leading-tight">Authentic Bhutanese <br className="hidden md:block" /> Journey <span className="text-accent italic font-normal">Overview</span></h2>
                    <p className="text-secondary font-light text-lg leading-relaxed mb-16 tracking-wide">
                      {displayDescription}
                    </p>


                  </motion.div>
                )}

                {activeTab === 'itinerary' && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {displayItinerary.map((item) => (
                      <div key={item.day} className="group flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10 p-6 sm:p-8 md:p-10 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-minimal border border-primary/5 hover:shadow-premium transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="flex flex-col items-center shrink-0">
                          <span className="text-accent font-heading font-medium text-4xl italic leading-none">{item.day}</span>
                          <div className="hidden md:block w-[1px] h-full bg-primary/10 my-4" />
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-heading font-medium text-primary mb-3 flex items-center space-x-3 tracking-wide">
                            <span>{item.title}</span>
                          </h4>
                          <p className="text-secondary font-light text-sm leading-relaxed tracking-wide">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'amenities' && (
                  <motion.div
                    key="amenities"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {displayAmenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-start space-x-6 p-6 bg-white rounded-[2rem] shadow-minimal border border-primary/5 hover:shadow-premium transition-shadow duration-500">
                        <div className="w-16 h-16 bg-bg-alt rounded-full flex items-center justify-center text-primary shrink-0 border border-primary/5">
                          <amenity.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-heading font-medium text-xl text-primary mb-2">{amenity.label}</h4>
                          <p className="text-secondary font-light text-sm leading-relaxed tracking-wide">{amenity.desc}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Dynamic Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-8">
              {/* Booking Widget */}
              <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-primary border border-primary/5 shadow-premium relative overflow-hidden group">
                <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="font-heading font-semibold text-xl text-primary mb-2">Plan Your Visit</h3>
                  <p className="text-secondary font-light text-sm leading-relaxed mb-8">
                    Pricing depends on your dates, group size, and preferences — our team will confirm your quote once you request a booking.
                  </p>

                  <button
                    onClick={() => navigate('/booking', { state: { destinationName: destination.name, image: cacheBustedImage } })}
                    className="w-full btn-accent py-5 text-sm shadow-premium"
                  >
                    Plan Your Trip
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>

              {/* Assistance Card */}
              <div 
                onClick={() => navigate('/contact')}
                className="bg-white rounded-[2rem] p-8 shadow-minimal border border-primary/5 flex items-center space-x-5 hover:shadow-premium transition-shadow duration-500 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-bg-alt flex items-center justify-center text-primary shrink-0 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                  <MessageSquare className="w-6 h-6 transition-colors" />
                </div>
                <div>
                  <h4 className="font-heading font-medium text-lg text-primary leading-none mb-2 tracking-wide">Need Guidance?</h4>
                  <p className="text-secondary font-light text-xs tracking-wide">Talk to our concierge in Thimphu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default DestinationDetail