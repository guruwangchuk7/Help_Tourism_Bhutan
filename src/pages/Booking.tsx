import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, CreditCard, Gift, User, ArrowRight, ArrowLeft, ShieldCheck, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"

const Booking = () => {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const steps = [
        { title: 'Identity', icon: User, id: 1 },
        { title: 'Enhancements', icon: Gift, id: 2 },
        { title: 'Liquidation', icon: CreditCard, id: 3 },
    ]

    const handleNext = () => {
        if (step < 3) setStep(step + 1)
        else {
            // Mock Final Action
            alert('Your journey has been secured. Welcome to Bhutan.')
            navigate('/')
        }
    }

    return (
        <PageTransition>
            <div className="pt-32 pb-32 bg-bg-light min-h-screen border-t border-primary/5">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Superior Progress Bar */}
                    <div className="flex items-center justify-between mb-16 md:mb-24 max-w-3xl mx-auto relative px-4 md:px-10">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/5 -translate-y-1/2 -z-10 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-[2px] bg-primary transition-all duration-700 -translate-y-1/2 -z-10 rounded-full"
                            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((s) => (
                            <div key={s.id} className="relative flex flex-col items-center group">
                                <motion.div
                                    animate={{
                                        scale: step >= s.id ? 1 : 0.9,
                                        backgroundColor: step >= s.id ? "var(--color-primary)" : "var(--color-white)",
                                        color: step >= s.id ? "var(--color-white)" : "var(--color-secondary)",
                                        borderColor: step === s.id ? "var(--color-accent)" : step > s.id ? "transparent" : "var(--color-primary)/5"
                                    }}
                                    className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all z-10 border-2 shadow-minimal group-hover:shadow-premium`}
                                >
                                    {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                                </motion.div>
                                <span className={`absolute -bottom-8 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.2em] transition-colors ${step >= s.id ? 'text-primary' : 'text-secondary/60'
                                    }`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Content Area (8 cols) */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-minimal border border-primary/5 min-h-[600px] flex flex-col relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex-1"
                                        >
                                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium text-primary mb-12 tracking-tight leading-none">Primary <span className="text-accent italic font-normal">Travelers</span></h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="flex flex-col space-y-3">
                                                    <label className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em] pl-4">First Designation</label>
                                                    <input type="text" className="w-full bg-bg-alt border border-primary/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary text-base placeholder-secondary/50" placeholder="e.g. Tenzin" />
                                                </div>
                                                <div className="flex flex-col space-y-3">
                                                    <label className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em] pl-4">Last Designation</label>
                                                    <input type="text" className="w-full bg-bg-alt border border-primary/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary text-base placeholder-secondary/50" placeholder="e.g. Dorji" />
                                                </div>
                                                <div className="flex flex-col space-y-3 md:col-span-2 mt-4">
                                                    <label className="text-[10px] font-medium text-secondary uppercase tracking-[0.2em] pl-4">Digital Identity (Email)</label>
                                                    <input type="email" className="w-full bg-bg-alt border border-primary/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary text-base placeholder-secondary/50" placeholder="tenzin@bhutan.com" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            className="flex-1"
                                        >
                                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium text-primary mb-12 tracking-tight leading-none">Refine Your <br className="hidden md:block" /> <span className="text-accent italic font-normal">Experience</span></h2>
                                            <div className="space-y-6">
                                                {[
                                                    { title: 'Spiritual Concierge', price: '$150', desc: 'Private sessions with local Rinpoches.', icon: '🧘' },
                                                    { title: 'Luxury Aviation', price: '$850', desc: 'Chartered helicopter flight over the peaks.', icon: '🚁' },
                                                    { title: 'Gourmet Wilderness', price: '$120', desc: '5-course private dinner in a pine forest.', icon: '🍷' }
                                                ].map(addon => (
                                                    <div key={addon.title} className="group flex flex-col md:flex-row md:items-center justify-between p-8 bg-bg-alt rounded-[2rem] border border-primary/5 hover:border-accent hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-premium gap-6">
                                                        <div className="flex items-center space-x-6">
                                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-minimal group-hover:scale-110 transition-transform duration-500 border border-primary/5">{addon.icon}</div>
                                                            <div>
                                                                <h4 className="font-heading font-medium text-2xl text-primary tracking-wide mb-1">{addon.title}</h4>
                                                                <p className="text-secondary font-light text-sm tracking-wide">{addon.desc}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row md:flex-col items-center justify-between md:items-end">
                                                            <span className="font-heading font-semibold text-accent text-2xl">{addon.price}</span>
                                                            <div className="mt-0 md:mt-2 w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors duration-300">
                                                                <div className="w-3 h-3 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex-1"
                                        >
                                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium text-primary mb-12 tracking-tight leading-none">Liquidation <br className="hidden md:block" /> <span className="text-accent italic font-normal">Protocol</span></h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                                <input type="text" className="md:col-span-2 bg-bg-alt border border-primary/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary placeholder-secondary/50 tracking-widest text-lg" placeholder="Card Identity Number" />
                                                <input type="text" className="bg-bg-alt border border-primary/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary placeholder-secondary/50 text-center tracking-widest" placeholder="Horizon MM/YY" />
                                                <input type="text" className="bg-bg-alt border border-primary/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary placeholder-secondary/50 text-center tracking-widest" placeholder="Security CVV" />
                                            </div>

                                            {/* Minimal Visual Hint */}
                                            <div className="mt-12 flex items-center justify-center space-x-6 text-secondary/40">
                                                <CreditCard className="w-8 h-8" />
                                                <ShieldCheck className="w-8 h-8" />
                                                <Zap className="w-8 h-8" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-16 pt-10 border-t border-primary/5 flex items-center justify-between">
                                    {step > 1 ? (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="flex items-center space-x-2 text-secondary font-medium uppercase tracking-[0.2em] text-[10px] hover:text-primary transition-colors group"
                                        >
                                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            <span>Revisit</span>
                                        </button>
                                    ) : <div />}

                                    <button
                                        onClick={handleNext}
                                        className="btn-primary"
                                    >
                                        <span>{step === 3 ? 'Finalize Order' : 'Proceed System'}</span>
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Superior Order Sidebar (4 cols) */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-minimal border border-primary/5 overflow-hidden relative">
                                    <h3 className="text-2xl font-heading font-medium text-primary mb-8 tracking-wide">Expedition <span className="text-accent italic font-normal">Manifest</span></h3>

                                    <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-primary/5">
                                        <div className="w-full h-40 rounded-[2rem] overflow-hidden shadow-glass shrink-0 border border-primary/5">
                                            <img src="/punakha-dzong.jpg" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="" />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-semibold text-xl text-primary leading-tight mb-2 tracking-wide">Punakha Sacred Grounds Tour</h4>
                                            <p className="text-[9px] font-medium text-accent uppercase tracking-[0.2em] flex items-center">
                                                <Zap className="w-3 h-3 mr-1" />
                                                Premium Private Slot
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">Base Itinerary (x2)</span>
                                            <span className="font-heading font-semibold text-primary tracking-wide">$1,798.00</span>
                                        </div>
                                        <div className="flex justify-between items-center group">
                                            <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">SDF Government Tax</span>
                                            <span className="font-heading font-semibold text-primary tracking-wide">$400.00</span>
                                        </div>
                                        <div className="flex justify-between items-center group">
                                            <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">Concierge Assistance</span>
                                            <span className="font-heading font-semibold text-accent tracking-wide">FREE</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-primary/10">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col gap-1">
                                                <span className="block text-[9px] font-medium text-secondary/60 uppercase tracking-[0.2em]">Total Expedition Debt</span>
                                                <span className="text-3xl font-heading font-semibold text-primary tracking-tight">$2,198.00</span>
                                            </div>
                                            <div className="bg-bg-alt p-3 rounded-full border border-primary/5">
                                                <ShieldCheck className="w-5 h-5 text-accent" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Secure Transaction Hint */}
                                <div className="flex justify-center items-center space-x-2 text-[9px] font-medium text-secondary/40 uppercase tracking-[0.2em]">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Encrypted by WanderVista Protocol</span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default Booking
