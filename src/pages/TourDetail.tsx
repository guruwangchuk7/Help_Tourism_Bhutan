import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, ShieldCheck, ChevronDown, Check, X } from "lucide-react"
import PageTransition from "../components/common/PageTransition"
import SEO from "../components/common/SEO"

import { DetailSkeleton } from "../components/common/Skeleton"

type Tour = {
  id: string
  title: string
  duration: string
  nights: number
  price: string
  priceVal: number
  image: string
  desc: string
  category: string
  difficulty: "Easy" | "Moderate" | "Challenging"
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; desc: string }[]
}

const TourDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [activeTab, setActiveTab] = useState<"itinerary" | "inclusions" | "essential">("itinerary")
  const [expandedDay, setExpandedDay] = useState<number | null>(1)

  const seoSchema = useMemo(() => {
    if (!tour) return null
    let displayDesc = tour.desc
    try {
      if (tour.desc.trim().startsWith('{')) {
        const parsed = JSON.parse(tour.desc)
        if (parsed.text) displayDesc = parsed.text
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
            "name": "Tours",
            "item": "https://www.helptourbhutan.com/tours"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": tour.title,
            "item": `https://www.helptourbhutan.com/tours/${tour.id}`
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Trip",
        "name": tour.title,
        "description": displayDesc,
        "image": `https://www.helptourbhutan.com${tour.image}`,
        "touristType": "Leisure, Cultural, Adventure",
        "offers": {
          "@type": "Offer",
          "price": tour.priceVal,
          "priceCurrency": "USD",
          "eligibleQuantity": {
            "@type": "QuantitativeValue",
            "value": 1
          }
        },
        "itinerary": tour.itinerary.map(item => ({
          "@type": "ItemList",
          "name": `Day ${item.day}: ${item.title}`,
          "description": item.desc
        }))
      }
    ]
  }, [tour])

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/tours/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch")
        }
        return res.json()
      })
      .then(data => {
        setTour(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return <DetailSkeleton />
  }

  if (error || !tour) {
    return (
      <PageTransition title="Tour Not Found | Help Tourism Bhutan" description="The requested Bhutan tour package could not be found.">
        <div className="min-h-[100dvh] bg-bg-light flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
          <div className="max-w-md bg-white border border-primary/5 rounded-[2.5rem] p-8 sm:p-12 shadow-premium space-y-6">
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] block">Error 404</span>
            <h1 className="text-3xl font-heading font-medium text-primary">Tour Not Found</h1>
            <p className="text-secondary font-light text-sm leading-relaxed">
              We couldn't retrieve the details for this tour. It may have been modified or is currently unavailable.
            </p>
            <Link to="/tours" className="btn-accent px-8 py-3 rounded-full mt-4 inline-block">
              Browse Tours
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  let displayDesc = tour.desc;
  let displayVisa = "We coordinate the entire visa process. The standard e-visa is applied in advance, and approval takes 3-5 days. The mandatory one-time $40 visa fee is handled on your behalf when booking this package.";
  let displayAltitude = "This tour reaches altitudes of up to 3,100 meters (Dochula Pass). Most trails are moderate. We recommend hiking shoes, thermal base layers, and modest clothing that covers shoulders and knees for visiting sacred temples (Dzongs).";
  let displayCurrency = "Bhutan's currency is the Ngultrum (equivalent to the Indian Rupee). Indian Rupees are accepted across Bhutan, but 500/2000 denomination notes are restricted. International credit cards are only accepted at premium luxury resorts; we recommend carrying some USD cash for personal expenses.";

  try {
    if (tour.desc.trim().startsWith('{')) {
      const parsed = JSON.parse(tour.desc);
      if (parsed.text) displayDesc = parsed.text;
      if (parsed.visaAdvice) displayVisa = parsed.visaAdvice;
      if (parsed.altitudeAdvice) displayAltitude = parsed.altitudeAdvice;
      if (parsed.currencyAdvice) displayCurrency = parsed.currencyAdvice;
    }
  } catch (e) {
    // Fail silently
  }



  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh] pb-32">
        <SEO
          title={`${tour.title} - Custom Bhutan Guided Tour | Help Tourism`}
          description={`Book the custom ${tour.title} with Help Tourism Bhutan. Category: ${tour.category}, Difficulty: ${tour.difficulty}. Includes certified guides, meals, hotels, visa handling, and custom routes.`}
          keywords={`${tour.title} bhutan, Bhutan tour packages, Bhutan customized tours, Bhutan guided tours, Bhutan travel itinerary, Bhutan visa and tour package`}
          ogImage={tour.image}
          schema={seoSchema || undefined}
        />
        {/* Full Image Hero Banner */}
        <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-visible">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={tour.image}
              className="w-full h-full object-cover"
              alt={tour.title}
            />
            <div className="absolute inset-0 bg-black/45 z-10" />
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/tours")}
            className="absolute top-28 left-6 sm:left-12 z-20 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/35 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">All Tours</span>
          </button>

          {/* Hero Copy */}
          <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-32 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 block">
                {tour.category} • {tour.difficulty}
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-[1.1] font-medium text-white">
                {tour.title}
              </h1>
              <p className="text-white/85 text-xs md:text-sm font-light max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.15em]">
                {displayDesc}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Details Grid */}
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Content Area (8 cols) */}
            <div className="lg:col-span-8">
              {/* Tab Navigation */}
              <div className="flex border-b border-primary/5 mb-10 overflow-x-auto gap-8">
                {[
                  { id: "itinerary", label: "Daily Itinerary" },
                  { id: "inclusions", label: "What's Enveloped" },
                  { id: "essential", label: "Practical Advice" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded ${
                      activeTab === tab.id
                        ? "border-accent text-primary font-bold"
                        : "border-transparent text-secondary/60 hover:text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "itinerary" && (
                <div className="space-y-4">
                  {tour.itinerary.map((item) => (
                    <div
                      key={item.day}
                      className="bg-white rounded-2xl border border-primary/5 overflow-hidden transition-all shadow-minimal hover:shadow-premium"
                    >
                      <button
                        onClick={() => toggleDay(item.day)}
                        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-heading font-semibold text-sm flex items-center justify-center shrink-0">
                            {item.day}
                          </div>
                          <div>
                            <span className="text-[9px] font-semibold text-secondary/60 uppercase tracking-widest block mb-0.5">
                              Day {item.day}
                            </span>
                            <h4 className="font-heading font-medium text-lg text-primary">{item.title}</h4>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-secondary transition-transform duration-300 ${
                            expandedDay === item.day ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {expandedDay === item.day && (
                        <div className="px-6 pb-6 pt-2 border-t border-primary/5 text-sm font-light text-secondary leading-relaxed tracking-wide">
                          {item.desc}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "inclusions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-primary/5 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-minimal">
                  {/* Inclusions */}
                  <div>
                    <h4 className="font-heading font-semibold text-primary text-base mb-6 uppercase tracking-wider flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-500" />
                      What's Included
                    </h4>
                    <ul className="space-y-4">
                      {tour.inclusions.map((inc, i) => (
                        <li key={i} className="flex gap-3 items-start text-sm font-light text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <h4 className="font-heading font-semibold text-primary text-base mb-6 uppercase tracking-wider flex items-center gap-2">
                      <X className="w-5 h-5 text-rose-500" />
                      What's Excluded
                    </h4>
                    <ul className="space-y-4">
                      {tour.exclusions.map((exc, i) => (
                        <li key={i} className="flex gap-3 items-start text-sm font-light text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "essential" && (
                <div className="bg-white border border-primary/5 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-minimal space-y-8">
                  <div>
                    <h4 className="font-heading font-medium text-lg text-primary mb-3">Bhutan Entry Visa & Permit</h4>
                    <p className="text-secondary text-sm font-light leading-relaxed tracking-wide">
                      {displayVisa}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading font-medium text-lg text-primary mb-3">Altitude & Packing Information</h4>
                    <p className="text-secondary text-sm font-light leading-relaxed tracking-wide">
                      {displayAltitude}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading font-medium text-lg text-primary mb-3">Currency & Connectivity</h4>
                    <p className="text-secondary text-sm font-light leading-relaxed tracking-wide">
                      {displayCurrency}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Booking Sidebar (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="bg-white rounded-[2.5rem] p-8 border border-primary/5 shadow-premium">
                <div className="mb-6 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-secondary/60 text-xs uppercase tracking-wider font-semibold">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>Duration</span>
                  </div>
                  <span className="text-sm font-heading font-semibold text-primary uppercase tracking-widest bg-bg-alt px-3 py-1 rounded-md">
                    {tour.duration}
                  </span>
                </div>

                <div className="mb-8 pb-6 border-b border-primary/5">
                  <span className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest block mb-1">
                    Package Price (All-Inclusive)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-heading font-bold text-primary">{tour.price}</span>
                    <span className="text-xs text-secondary font-light">/ person</span>
                  </div>
                  <p className="text-[9px] text-accent/80 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Includes $100/night government SDF & Visa fee
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() =>
                      navigate("/booking", {
                        state: {
                          destinationName: tour.title,
                          nights: tour.nights,
                          adults: 2,
                          totalPrice: tour.priceVal * 2, // standard 2 travelers
                          image: tour.image
                        }
                      })
                    }
                    className="btn-accent w-full py-4 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-premium cursor-pointer"
                  >
                    <span>Request Booking</span>
                  </button>

                  <button
                    onClick={() => navigate("/contact")}
                    className="w-full py-4 bg-transparent border border-primary/10 hover:border-accent text-primary hover:text-accent font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Inquire details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

export default TourDetail
