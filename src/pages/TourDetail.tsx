import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { tours } from "../data/tours"
import { ArrowLeft, Clock, ShieldCheck, ChevronDown, Check, X } from "lucide-react"
import PageTransition from "../components/common/PageTransition"

const TourDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tour = tours.find((t) => t.id === id)

  const [activeTab, setActiveTab] = useState<"itinerary" | "inclusions" | "essential">("itinerary")
  const [expandedDay, setExpandedDay] = useState<number | null>(1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!tour) {
    return (
      <PageTransition>
        <div className="pt-40 pb-40 text-center min-h-[100dvh] bg-bg-light">
          <h2 className="text-3xl font-heading text-primary mb-4">Tour Not Found</h2>
          <p className="text-secondary mb-8">We couldn't find the expedition you were looking for.</p>
          <Link to="/tours" className="btn-accent px-8 py-3 rounded-full">
            Back to Tours
          </Link>
        </div>
      </PageTransition>
    )
  }

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh] pb-32">
        {/* Hero Section */}
        <section className="relative h-[60dvh] flex items-center justify-center overflow-hidden">
          <img
            src={tour.image}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
            alt={tour.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-light via-transparent to-black/20" />

          {/* Back button */}
          <button
            onClick={() => navigate("/tours")}
            className="absolute top-28 left-6 sm:left-12 z-20 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/35 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">All Tours</span>
          </button>

          <div className="relative z-10 text-center px-6 max-w-4xl pt-16">
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 block">
              {tour.category} • {tour.difficulty}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-medium text-white tracking-tight leading-none mb-6">
              {tour.title}
            </h1>
            <p className="text-white/80 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              {tour.desc}
            </p>
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
                    className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all shrink-0 cursor-pointer ${
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-primary/5 rounded-[2rem] p-10 shadow-minimal">
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
                <div className="bg-white border border-primary/5 rounded-[2rem] p-10 shadow-minimal space-y-8">
                  <div>
                    <h4 className="font-heading font-medium text-lg text-primary mb-3">Bhutan Entry Visa & Permit</h4>
                    <p className="text-secondary text-sm font-light leading-relaxed tracking-wide">
                      We coordinate the entire visa process. The standard e-visa is applied in advance, and approval takes 3-5 days. The mandatory one-time $40 visa fee is handled on your behalf when booking this package.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading font-medium text-lg text-primary mb-3">Altitude & Packing Information</h4>
                    <p className="text-secondary text-sm font-light leading-relaxed tracking-wide">
                      This tour reaches altitudes of up to 3,100 meters (Dochula Pass). Most trails are moderate. We recommend hiking shoes, thermal base layers, and modest clothing that covers shoulders and knees for visiting sacred temples (Dzongs).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading font-medium text-lg text-primary mb-3">Currency & Connectivity</h4>
                    <p className="text-secondary text-sm font-light leading-relaxed tracking-wide">
                      Bhutan's currency is the Ngultrum (equivalent to the Indian Rupee). Indian Rupees are accepted across Bhutan, but 500/2000 denomination notes are restricted. International credit cards are only accepted at premium luxury resorts; we recommend carrying some USD cash for personal expenses.
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
                          totalPrice: tour.priceVal * 2 // standard 2 travelers
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
