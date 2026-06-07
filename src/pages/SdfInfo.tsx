import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, ArrowRight, Heart, Award, Sparkles, DollarSign } from "lucide-react"
import PageTransition from "../components/common/PageTransition"
import SEO from "../components/common/SEO"

const SdfInfo = () => {
  const navigate = useNavigate()

  // Calculator state
  const [nights, setNights] = useState(7)
  const [adults, setAdults] = useState(2)
  const [childrenOlder, setChildrenOlder] = useState(0) // 6-11 years
  const [childrenYounger, setChildrenYounger] = useState(0) // under 6 years
  const [nationality, setNationality] = useState<"standard" | "indian" | "bangladeshi">("standard")

  // Calculate totals
  const getSdfPerNight = () => {
    if (nationality === "indian") {
      return { adult: 15, child: 7.25, baby: 0 } // approx in USD (INR 1200 / 600)
    }
    if (nationality === "bangladeshi") {
      return { adult: 15, child: 15, baby: 0 }
    }
    return { adult: 100, child: 50, baby: 0 }
  }

  const sdfRates = getSdfPerNight()
  const visaFee = nationality === "indian" ? 0 : 40 // Indian nationals don't pay standard visa fee, they pay entry permit online
  
  const adultSdfTotal = adults * nights * sdfRates.adult
  const childSdfTotal = childrenOlder * nights * sdfRates.child
  const totalSdf = adultSdfTotal + childSdfTotal
  const totalVisa = (adults + childrenOlder + childrenYounger) * visaFee
  const grandTotal = totalSdf + totalVisa

  const activeRatesText = nationality === "indian" 
    ? "INR 1,200 (Adults) / INR 600 (Ages 6-11) per night"
    : nationality === "bangladeshi"
      ? "$15 per night (for the first 15,000 visitors/year)"
      : "$100 (Adults) / $50 (Ages 6-11) per night"

  const sdfSchema = useMemo(() => {
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
            "name": "SDF Info",
            "item": "https://www.helptourbhutan.com/sdf"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the Sustainable Development Fee (SDF) in Bhutan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Sustainable Development Fee (SDF) is a mandatory daily levy paid to the Royal Government of Bhutan to fund free healthcare, education, environmental conservation, and cultural heritage preservation."
            }
          },
          {
            "@type": "Question",
            "name": "What are the current SDF rates for travelers visiting Bhutan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The current standard rate is $100 USD per adult per night, and $50 USD per child per night (ages 6 to 11). Children under 6 years are exempt from paying the SDF fee."
            }
          },
          {
            "@type": "Question",
            "name": "Do Indian citizens have to pay the daily SDF fee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Indian citizens pay a reduced rate of INR 1,200 (approx. $15 USD) per adult per night. Children aged 6-11 pay INR 600 per night."
            }
          }
        ]
      }
    ]
  }, [])

  return (
    <PageTransition>
      <div className="pt-24 bg-bg-light min-h-[100dvh]">
        <SEO
          title="Bhutan SDF Fee & Visa Guide 2026 | Sustainable Tourism Tax"
          description="Learn about the Bhutan Sustainable Development Fee (SDF) guidelines, travel requirements, pricing for kids and Indian nationals, and use our interactive SDF calculator."
          keywords="Bhutan sustainable tourism, Eco tourism Bhutan, Sustainable Development Fee Bhutan, Bhutan visa and tour package, Bhutan travel requirements, how to pay Bhutan SDF"
          schema={sdfSchema}
        />
        {/* Cinematic Hero */}
        <section className="relative h-[45dvh] flex items-center justify-center overflow-hidden">
          <img
            src="/dochula-pass.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.55]"
            alt="Bhutan Sustainable Development Fee"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-light via-transparent to-black/25" />

          <div className="relative z-10 text-center px-6 max-w-3xl">
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 block">Sustainable Tourism</span>
            <h1 className="text-4xl sm:text-6xl font-heading font-medium text-white tracking-tight leading-none mb-6">
              Bhutan <span className="text-accent italic font-normal">SDF Fee</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              Every traveler to Bhutan contributes directly to the preservation of carbon-negative forests, free healthcare, education, and cultural heritage.
            </p>
          </div>
        </section>

        {/* Content & Calculator Grid */}
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: SDF Information (7 cols) */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <span className="text-accent font-semibold uppercase tracking-[0.3em] text-[10px] mb-3 block font-body">Overview</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-medium text-primary mb-6">What is the Sustainable Development Fee?</h2>
                <p className="text-secondary font-light text-base leading-relaxed tracking-wide mb-6">
                  The Sustainable Development Fee (SDF) is a mandatory daily levy paid to the Royal Government of Bhutan. Since opening to tourism in 1974, Bhutan has avoided mass tourism in favor of a <strong>"High Value, Low Volume"</strong> philosophy, placing ecological preservation and gross national happiness above volume.
                </p>
                <div className="bg-white border border-primary/5 rounded-[2rem] p-8 shadow-minimal">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-medium text-lg text-primary mb-2">50% Reduced Rate Active</h4>
                      <p className="text-secondary text-sm font-light leading-relaxed">
                        To encourage post-pandemic travel, the government introduced a 50% discount on the base rate. The current rate of <strong>$100 USD per night</strong> (down from $200 USD) is officially locked in and valid through <strong>August 31, 2027</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Where does it go? */}
              <div>
                <h3 className="text-2xl font-heading font-medium text-primary mb-8">Where Does Your Contribution Go?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Heart,
                      title: "Health & Education",
                      desc: "Fully funds free universal healthcare and public education (primary to university level) for all Bhutanese citizens."
                    },
                    {
                      icon: Award,
                      title: "Cultural Heritage",
                      desc: "Supports the meticulous restoration of historic Dzongs (monastery-fortresses), traditional arts, and cultural preservation."
                    },
                    {
                      icon: ShieldCheck,
                      title: "Conservation",
                      desc: "Maintains Bhutan's constitutional mandate of keeping 60%+ forest cover, keeping the kingdom carbon-negative."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-primary/5 shadow-minimal">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-semibold text-sm text-primary mb-2">{item.title}</h4>
                      <p className="text-secondary/80 text-xs font-light leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Regulations */}
              <div className="space-y-6">
                <h3 className="text-2xl font-heading font-medium text-primary">Special Exemptions & Regulations</h3>
                <div className="divide-y divide-primary/5 text-sm">
                  <div className="py-4 flex justify-between gap-4">
                    <span className="font-medium text-primary">Children Under 6</span>
                    <span className="text-accent font-semibold text-right">100% Exempt (Free)</span>
                  </div>
                  <div className="py-4 flex justify-between gap-4">
                    <span className="font-medium text-primary">Children Ages 6–11</span>
                    <span className="text-accent font-semibold text-right">50% Discount ($50 USD/night)</span>
                  </div>
                  <div className="py-4 flex justify-between gap-4">
                    <span className="font-medium text-primary">24-Hour Border Rule</span>
                    <span className="text-secondary text-right">No SDF fee for stays up to 24 hours in border towns (Phuentsholing, Samtse, Gelephu, Samdrup Jongkhar).</span>
                  </div>
                  <div className="py-4 flex justify-between gap-4">
                    <span className="font-medium text-primary">Business MICE Waiver</span>
                    <span className="text-secondary text-right">Groups of 7+ participants attending conferences/exhibitions can request exemption for up to 4 nights.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Calculator Sidebar (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="bg-white rounded-[2.5rem] p-8 border border-primary/5 shadow-premium">
                <h3 className="text-2xl font-heading font-medium text-primary mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  SDF Calculator
                </h3>
                
                {/* Inputs */}
                <div className="space-y-6">
                  {/* Nationality selector */}
                  <div>
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 block">Origin / Nationality</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "standard", label: "International" },
                        { id: "indian", label: "Indian" },
                        { id: "bangladeshi", label: "Bangladeshi" }
                      ].map((nat) => (
                        <button
                          key={nat.id}
                          type="button"
                          onClick={() => setNationality(nat.id as any)}
                          className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            nationality === nat.id
                              ? "bg-primary border-primary text-white"
                              : "bg-bg-alt border-primary/5 text-primary hover:bg-white"
                          }`}
                        >
                          {nat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nights */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">Duration of Stay</label>
                      <span className="text-xs font-semibold text-primary">{nights} Night{nights > 1 ? "s" : ""}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full h-1.5 bg-bg-alt rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Travelers counters */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-semibold text-primary">Adults</span>
                        <span className="text-[9px] text-secondary">Ages 12 and up</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults(adults - 1)}
                          className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt disabled:opacity-30 text-primary cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-heading font-medium text-base text-primary min-w-[20px] text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-semibold text-primary">Children</span>
                        <span className="text-[9px] text-secondary">Ages 6–11 (50% SDF)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={childrenOlder <= 0}
                          onClick={() => setChildrenOlder(childrenOlder - 1)}
                          className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt disabled:opacity-30 text-primary cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-heading font-medium text-base text-primary min-w-[20px] text-center">{childrenOlder}</span>
                        <button
                          type="button"
                          onClick={() => setChildrenOlder(childrenOlder + 1)}
                          className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-semibold text-primary">Infants / Toddlers</span>
                        <span className="text-[9px] text-secondary">Under 6 years (Exempt)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={childrenYounger <= 0}
                          onClick={() => setChildrenYounger(childrenYounger - 1)}
                          className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt disabled:opacity-30 text-primary cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-heading font-medium text-base text-primary min-w-[20px] text-center">{childrenYounger}</span>
                        <button
                          type="button"
                          onClick={() => setChildrenYounger(childrenYounger + 1)}
                          className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="mt-8 pt-8 border-t border-primary/5 space-y-4">
                  <div className="flex justify-between items-center text-xs font-light text-secondary">
                    <span>Base SDF rate</span>
                    <span className="font-semibold text-primary">{activeRatesText}</span>
                  </div>

                  {nationality === "indian" && (
                    <div className="bg-bg-alt p-3.5 rounded-xl border border-accent/25 text-xs text-primary/80 font-medium">
                      Note: Indian Nationals pay INR 1,200/night directly (equivalent to approx. $15.00 USD/night).
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs font-light text-secondary">
                    <span>SDF Fee Total ({nights} nights)</span>
                    <span className="font-semibold text-primary">
                      {nationality === "indian" ? `INR ${(adults * nights * 1200 + childrenOlder * nights * 600).toLocaleString("en-IN")}` : `$${totalSdf.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-light text-secondary">
                    <span>Visa Fee ({nationality === "indian" ? "Entry Permit" : `$${visaFee} x ${adults + childrenOlder + childrenYounger}`})</span>
                    <span className="font-semibold text-primary">
                      {nationality === "indian" ? "FREE" : `$${totalVisa.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>

                  <div className="mt-6 pt-6 border-t border-primary/10 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-secondary/60 uppercase tracking-[0.2em] mb-1">Mandatory Government Debt</span>
                      <span className="text-3xl font-heading font-semibold text-primary tracking-tight">
                        {nationality === "indian" 
                          ? `INR ${(adults * nights * 1200 + childrenOlder * nights * 600).toLocaleString("en-IN")}` 
                          : `$${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/booking", {
                      state: {
                        adults: adults,
                        nights: nights,
                        totalPrice: grandTotal,
                        destinationName: "Bhutan Custom Itinerary (with SDF)",
                        image: "/dochula-pass.jpg"
                      }
                    })}
                    className="btn-accent w-full py-4 text-xs font-bold uppercase tracking-wider rounded-xl mt-6 flex items-center justify-center gap-2 shadow-premium cursor-pointer"
                  >
                    <span>Initiate Booking with SDF</span>
                    <ArrowRight className="w-4 h-4" />
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

export default SdfInfo
