import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Sparkles, Compass, Calendar, Home as HomeIcon, CheckCircle, MapPin, Mountain, Sun, Gift, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"

const TripBuilder = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Form states
  const [style, setStyle] = useState<string>("Culture")
  const [duration, setDuration] = useState<number>(7)
  const [month, setMonth] = useState<string>("October")
  const [groupSize, setGroupSize] = useState<number>(2)
  const [tier, setTier] = useState<string>("Boutique (4-Star)")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  // Estimated budget calculator
  const calculateEstimate = () => {
    let rate = 250 // standard 3-star
    if (tier.includes("4-Star")) rate = 450
    if (tier.includes("5-Star")) rate = 1200

    const sdf = 100
    const visa = 40
    
    const costPerPerson = duration * (rate + sdf) + visa
    return costPerPerson * groupSize
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    else {
      setStep(5)
      alert("Your custom travel manifest has been received. A Thimphu travel architect will contact you within 24 hours.")
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const steps = [
    { id: 1, label: "Style", icon: Compass },
    { id: 2, label: "Logistics", icon: Calendar },
    { id: 3, label: "Comfort", icon: HomeIcon },
    { id: 4, label: "Submit", icon: Sparkles }
  ]

  return (
    <PageTransition>
      <div className="pt-32 pb-32 bg-bg-light min-h-[100dvh] border-t border-primary/5">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* Header Title */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 block">Bespoke Planner</span>
            <h1 className="text-4xl md:text-5xl font-heading font-medium text-primary">Architect Your Trip</h1>
            <p className="text-secondary font-light text-sm mt-3 leading-relaxed">
              Plan your personalized itinerary with our Thimphu-based destination experts. Follow the steps below for an instant budget estimation.
            </p>
          </div>

          {/* Progress Indicators */}
          {step <= 4 && (
            <div className="flex items-center justify-between mb-16 max-w-2xl mx-auto relative px-6">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/5 -translate-y-1/2 -z-10 rounded-full" />
              <div
                className="absolute top-1/2 left-0 h-[2px] bg-accent transition-all duration-700 -translate-y-1/2 -z-10 rounded-full"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />

              {steps.map((s) => (
                <div key={s.id} className="relative flex flex-col items-center group">
                  <motion.div
                    animate={{
                      scale: step >= s.id ? 1 : 0.9,
                      backgroundColor: step >= s.id ? "var(--color-primary)" : "var(--color-white)",
                      color: step >= s.id ? "var(--color-white)" : "var(--color-secondary)",
                      borderColor: step === s.id ? "var(--color-accent)" : "transparent"
                    }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all z-10 border-2 shadow-minimal"
                  >
                    <s.icon className="w-4 h-4" />
                  </motion.div>
                  <span className={`absolute -bottom-8 whitespace-nowrap text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${
                    step >= s.id ? 'text-primary' : 'text-secondary/60'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-primary/5 shadow-premium max-w-3xl mx-auto min-h-[400px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl md:text-2xl font-heading font-medium text-primary mb-6">Select your travel style</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "Culture & Dzongs", desc: "Monasteries, history, and royal valleys.", icon: Compass },
                      { name: "Trekking & Wilderness", desc: "High mountain peaks, passes, and lakes.", icon: Mountain },
                      { name: "Luxury & Wellness", desc: "5-star spa resorts and helicopter transfers.", icon: Sparkles },
                      { name: "Spiritual retreats", desc: "Private meditations with local Rinpoches.", icon: Sun },
                      { name: "Festivals Edition", desc: "Colorful Paro & Thimphu Tshechus.", icon: Gift }
                    ].map((item) => {
                      const IconComponent = item.icon
                      return (
                        <div
                          key={item.name}
                          onClick={() => setStyle(item.name)}
                          className={`p-6 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                            style === item.name 
                              ? "border-accent bg-accent/5 shadow-minimal" 
                              : "border-primary/5 hover:border-primary/20 bg-bg-alt/50 hover:bg-white"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center text-accent shrink-0">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-heading font-semibold text-sm text-primary">{item.name}</h4>
                            <p className="text-secondary text-[11px] font-light mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  className="space-y-8"
                >
                  <h3 className="text-xl md:text-2xl font-heading font-medium text-primary mb-6">Logistical preferences</h3>
                  
                  {/* Duration Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-secondary">
                      <span>Duration of Stay</span>
                      <span className="text-primary text-sm font-bold">{duration} Nights</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="30"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-1.5 bg-bg-alt rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Group Size */}
                  <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                    <div>
                      <span className="block text-sm font-semibold text-primary">Travelers Count</span>
                      <span className="text-[10px] text-secondary font-light">Number of adults traveling together</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={groupSize <= 1}
                        onClick={() => setGroupSize(groupSize - 1)}
                        className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt disabled:opacity-30 text-primary cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-heading font-semibold text-lg text-primary min-w-[20px] text-center">{groupSize}</span>
                      <button
                        type="button"
                        onClick={() => setGroupSize(groupSize + 1)}
                        className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center hover:bg-bg-alt text-primary cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Target Month */}
                  <div className="space-y-2 pt-4 border-t border-primary/5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Preferred Travel Period</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Spring (Mar-May)", "Summer (Jun-Aug)", "Fall (Sep-Nov)", "Winter (Dec-Feb)"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMonth(m)}
                          className={`py-2 px-1 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            month === m
                              ? "bg-primary border-primary text-white"
                              : "bg-bg-alt border-primary/5 text-primary hover:bg-white"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl md:text-2xl font-heading font-medium text-primary mb-6">Select accommodation comfort level</h3>
                  <div className="space-y-4">
                    {[
                      { tier: "Standard (3-Star)", desc: "Heritage hotels and traditional cottages.", rate: "$350 / night (Inc. SDF & Visa)", icon: HomeIcon },
                      { tier: "Boutique (4-Star)", desc: "Tailored boutique lodges with private spa access.", rate: "$550 / night (Inc. SDF & Visa)", icon: MapPin },
                      { tier: "Ultra-Luxury (5-Star)", desc: "Five-star premium suites (Amankora, Six Senses, COMO).", rate: "$1,300 / night (Inc. SDF & Visa)", icon: Star }
                    ].map((item) => {
                      const IconComponent = item.icon
                      return (
                        <div
                          key={item.tier}
                          onClick={() => setTier(item.tier)}
                          className={`p-6 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                            tier === item.tier 
                              ? "border-accent bg-accent/5 shadow-minimal" 
                              : "border-primary/5 hover:border-primary/20 bg-bg-alt/50 hover:bg-white"
                          }`}
                        >
                          <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center text-accent shrink-0">
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-heading font-semibold text-sm text-primary">{item.tier}</h4>
                              <p className="text-secondary text-[11px] font-light mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-heading font-bold text-sm text-accent block">{item.rate}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl md:text-2xl font-heading font-medium text-primary mb-6">Complete your custom manifest</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider pl-4">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-bg-alt border border-primary/5 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent/20 transition-all text-primary placeholder-secondary/40 font-light"
                        placeholder="e.g. Jigme Dorji"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider pl-4">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-bg-alt border border-primary/5 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent/20 transition-all text-primary placeholder-secondary/40 font-light"
                        placeholder="e.g. jigme@bhutan.bt"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-wider pl-4">Special Requests / Preferences</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full bg-bg-alt border border-primary/5 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent/20 transition-all text-primary placeholder-secondary/40 font-light resize-none"
                        placeholder="Describe special festivals, food restrictions, treks, or details you wish to include..."
                      />
                    </div>
                  </div>

                  {/* Budget Estimation card */}
                  <div className="bg-bg-alt/70 border border-primary/5 rounded-2xl p-6 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-secondary/60 uppercase tracking-widest block mb-0.5">Estimated Expenditure</span>
                      <span className="text-2xl font-heading font-semibold text-primary">
                        ${calculateEstimate().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-left sm:text-right text-[10px] text-secondary font-light max-w-xs sm:max-w-[180px] leading-relaxed">
                      Includes visa, mandatory government SDF, hotels, guide, transfers, & food.
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-medium text-primary">Travel Manifest Received</h3>
                  <p className="text-secondary font-light text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{name}</strong>. An expert Bhutan travel architect has been assigned to your request and will format a custom itinerary proposal for your review within 24 hours.
                  </p>
                  <div className="bg-bg-alt border border-primary/5 p-6 rounded-2xl max-w-sm mx-auto text-left space-y-2 text-xs font-light text-secondary">
                    <p>• <strong>Selected Style:</strong> {style}</p>
                    <p>• <strong>Duration:</strong> {duration} Nights ({month})</p>
                    <p>• <strong>Group Size:</strong> {groupSize} Travelers</p>
                    <p>• <strong>Hotel comfort class:</strong> {tier}</p>
                  </div>
                  <button
                    onClick={() => navigate("/")}
                    className="btn-accent px-8 py-3 rounded-full mt-6"
                  >
                    Return to home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            {step <= 4 && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-primary/5">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 text-secondary hover:text-primary font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{step === 4 ? "Submit Manifest" : "Next Step"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default TripBuilder
