import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Gift, User, ArrowRight, ArrowLeft, ShieldCheck, Zap, Loader2, Sparkles, Plane, Utensils, Mail, Calendar, Lock, Check } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"
import { loadStripe } from "@stripe/stripe-js"
import { destinations } from "../data/destinations"
import { tours } from "../data/tours"

const Booking = () => {
    const navigate = useNavigate()
    const locationState = useLocation().state as {
        adults?: number
        nights?: number
        startDate?: string
        endDate?: string
        destinationName?: string
        totalPrice?: number
    } | null

    const [step, setStep] = useState(1)
    const [selectedAddons, setSelectedAddons] = useState<string[]>([])
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'stripe' | 'whatsapp' | 'offline'>('card')
    const [isProcessingStripe, setIsProcessingStripe] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardExpiry, setCardExpiry] = useState("")
    const [cardCvv, setCardCvv] = useState("")

    const addonPrices: { [key: string]: number } = {
        'Spiritual Concierge': 150,
        'Luxury Aviation': 850,
        'Gourmet Wilderness': 120
    }

    const toggleAddon = (title: string) => {
        if (selectedAddons.includes(title)) {
            setSelectedAddons(selectedAddons.filter(item => item !== title))
        } else {
            setSelectedAddons([...selectedAddons, title])
        }
    }

    const addonTotal = selectedAddons.reduce((sum, title) => sum + (addonPrices[title] || 0), 0)
    const basePrice = locationState?.totalPrice || 1798.00
    const tax = locationState ? 0 : 400.00
    const totalPrice = basePrice + tax + addonTotal

    const matchedDestination = destinations.find(d => d.name === locationState?.destinationName)
    const matchedTour = tours.find(t => t.title === locationState?.destinationName)
    const displayImage = matchedDestination?.image || matchedTour?.image || "/punakha-dzong.jpg"
    const displayTitle = locationState?.destinationName || "Punakha Sacred Grounds Tour"

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const steps = [
        { title: 'Identity', icon: User, id: 1 },
        { title: 'Enhancements', icon: Gift, id: 2 },
        { title: 'Payment', icon: CreditCard, id: 3 },
    ]

    const handleStripeCheckout = async () => {
        setIsProcessingStripe(true)
        try {
            const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
            const stripePriceId = import.meta.env.VITE_STRIPE_PRICE_ID || ''
            const stripe = await loadStripe(stripeKey)
            if (stripe) {
                const { error } = await (stripe as any).redirectToCheckout({
                    lineItems: [{
                        price: stripePriceId,
                        quantity: 1,
                    }],
                    mode: 'payment',
                    successUrl: `${window.location.origin}/`,
                    cancelUrl: `${window.location.origin}/booking`,
                })
                if (error) {
                    console.error('Stripe redirect error:', error)
                    alert(`Stripe checkout error: ${error.message}`)
                }
            } else {
                alert('Stripe SDK failed to load.')
            }
        } catch (err) {
            console.error('Stripe checkout error:', err)
            alert('Stripe redirect simulated. Make sure Client-only integration is enabled in your Stripe Dashboard, and replace the placeholder Price ID and Publishable Key in Booking.tsx.')
            navigate('/')
        } finally {
            setIsProcessingStripe(false)
        }
    }

    const handleNext = () => {
        if (step < 3) setStep(step + 1)
        else {
            if (paymentMethod === 'card') {
                alert('Your journey has been secured. Welcome to Bhutan.')
                navigate('/')
            } else if (paymentMethod === 'stripe') {
                handleStripeCheckout()
            } else if (paymentMethod === 'whatsapp') {
                window.open('https://wa.me/97517609800', '_blank')
                alert('Opening WhatsApp support...')
                navigate('/')
            } else {
                alert('Booking inquiry sent. A Thimphu travel architect will contact you shortly with localized payment instructions.')
                navigate('/')
            }
        }
    }

    return (
        <PageTransition>
            <div className="pt-32 pb-32 bg-bg-light min-h-[100dvh] border-t border-primary/5">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Redesigned Minimalist Stepper */}
                    <div className="mb-20 md:mb-28 max-w-3xl mx-auto relative px-8 md:px-12 z-10">
                        {/* Thin Connective Line */}
                        <div className="absolute top-[14px] md:top-[16px] left-[46px] right-[46px] md:left-[64px] md:right-[64px] h-[1px] bg-primary/10 -translate-y-1/2 -z-10 rounded-full">
                            <div
                                className="h-full bg-accent transition-all duration-700 rounded-full"
                                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            {steps.map((s) => {
                                const isCompleted = step > s.id
                                const isActive = step === s.id
                                return (
                                    <div key={s.id} className="relative flex flex-col items-center group">
                                        <motion.div
                                            animate={{
                                                scale: isActive ? 1.05 : 1,
                                            }}
                                            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all z-10 border text-[10px] md:text-[11px] font-bold relative duration-300
                                                ${isCompleted 
                                                    ? 'bg-accent border-accent text-white shadow-glass' 
                                                    : isActive 
                                                        ? 'bg-primary border-accent text-white ring-4 ring-accent/20' 
                                                        : 'bg-white border-primary/10 text-secondary/30'
                                                }`}
                                        >
                                            {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.id}
                                        </motion.div>
                                        <span className={`absolute -bottom-7 whitespace-nowrap text-[8px] md:text-[9px] font-normal uppercase tracking-[0.15em] transition-colors duration-300
                                            ${isActive 
                                                ? 'text-primary font-normal' 
                                                : isCompleted 
                                                    ? 'text-accent' 
                                                    : 'text-secondary/40'
                                            }`}
                                        >
                                            {s.title}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Content Area (8 cols) */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 shadow-minimal border border-primary/5 min-h-[600px] flex flex-col relative overflow-hidden">
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
                                            {locationState && (
                                                <div className="bg-bg-alt border border-accent/20 rounded-2xl p-5 mb-8 text-sm text-primary font-medium">
                                                    Booking: <span className="text-accent font-semibold">{locationState.destinationName}</span> for <span className="font-semibold">{locationState.nights} Night{locationState.nights && locationState.nights > 1 ? 's' : ''}</span> with <span className="font-semibold">{locationState.adults} Guest{locationState.adults && locationState.adults > 1 ? 's' : ''}</span>.
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="flex flex-col space-y-3 relative">
                                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] pl-4">First Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/60 w-5 h-5 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            className="w-full bg-bg-alt border border-primary/5 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary text-base placeholder-secondary/30" 
                                                            placeholder="e.g. Tenzin" 
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-3 relative">
                                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] pl-4">Last Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/60 w-5 h-5 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            className="w-full bg-bg-alt border border-primary/5 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary text-base placeholder-secondary/30" 
                                                            placeholder="e.g. Dorji" 
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-3 md:col-span-2 mt-4 relative">
                                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] pl-4">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/60 w-5 h-5 pointer-events-none" />
                                                        <input 
                                                            type="email" 
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="w-full bg-bg-alt border border-primary/5 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary text-base placeholder-secondary/30" 
                                                            placeholder="tenzin@bhutan.com" 
                                                            required
                                                        />
                                                    </div>
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
                                                    { title: 'Spiritual Concierge', price: '$150', desc: 'Private sessions with local Rinpoches.', icon: Sparkles },
                                                    { title: 'Luxury Aviation', price: '$850', desc: 'Chartered helicopter flight over the peaks.', icon: Plane },
                                                    { title: 'Gourmet Wilderness', price: '$120', desc: '5-course private dinner in a pine forest.', icon: Utensils }
                                                ].map(addon => {
                                                    const IconComponent = addon.icon
                                                    return (
                                                        <div
                                                            key={addon.title}
                                                            onClick={() => toggleAddon(addon.title)}
                                                            className={`group flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8 bg-bg-alt rounded-[2rem] border transition-all cursor-pointer shadow-none hover:shadow-premium gap-6 ${selectedAddons.includes(addon.title) ? 'border-accent bg-white shadow-premium' : 'border-primary/5'
                                                                }`}
                                                        >
                                                            <div className="flex items-center space-x-6">
                                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-accent shadow-minimal group-hover:scale-110 transition-transform duration-500 border border-primary/5">
                                                                    <IconComponent className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-heading font-medium text-2xl text-primary tracking-wide mb-1">{addon.title}</h4>
                                                                    <p className="text-secondary font-light text-sm tracking-wide">{addon.desc}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row md:flex-col items-center justify-between md:items-end">
                                                                <span className="font-heading font-semibold text-accent text-2xl">{addon.price}</span>
                                                                <div className={`mt-0 md:mt-2 w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-300 ${selectedAddons.includes(addon.title) ? 'border-accent bg-accent/10' : 'border-primary/20 group-hover:border-accent group-hover:bg-accent/10'
                                                                    }`}>
                                                                    <div className={`w-3 h-3 rounded-full bg-accent transition-transform duration-300 ${selectedAddons.includes(addon.title) ? 'scale-100' : 'scale-0 group-hover:scale-100'
                                                                        }`} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
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
                                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-medium text-primary mb-12 tracking-tight leading-none">Choose <br className="hidden md:block" /> <span className="text-accent italic font-normal">Payment</span></h2>

                                            {/* Payment Option Tabs Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('card')}
                                                    className={`py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-[10px] border transition-all cursor-pointer ${paymentMethod === 'card'
                                                            ? 'bg-primary border-primary text-white shadow-md'
                                                            : 'bg-bg-alt border-primary/5 text-primary hover:bg-white'
                                                        }`}
                                                >
                                                    Credit / Debit Card
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('stripe')}
                                                    className={`py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-[10px] border transition-all cursor-pointer ${paymentMethod === 'stripe'
                                                            ? 'bg-primary border-primary text-white shadow-md'
                                                            : 'bg-bg-alt border-primary/5 text-primary hover:bg-white'
                                                        }`}
                                                >
                                                    Pay with Stripe
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('whatsapp')}
                                                    className={`py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-[10px] border transition-all cursor-pointer ${paymentMethod === 'whatsapp'
                                                            ? 'bg-primary border-primary text-white shadow-md'
                                                            : 'bg-bg-alt border-primary/5 text-primary hover:bg-white'
                                                        }`}
                                                >
                                                    Pay via WhatsApp Chat
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('offline')}
                                                    className={`py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-[10px] border transition-all cursor-pointer ${paymentMethod === 'offline'
                                                            ? 'bg-primary border-primary text-white shadow-md'
                                                            : 'bg-bg-alt border-primary/5 text-primary hover:bg-white'
                                                        }`}
                                                >
                                                    Bank Wire / Support
                                                </button>
                                            </div>

                                            {paymentMethod === 'card' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                                    <div className="md:col-span-2 relative">
                                                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/60 w-5 h-5 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={cardNumber}
                                                            onChange={(e) => setCardNumber(e.target.value)}
                                                            className="w-full bg-bg-alt border border-primary/5 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary placeholder-secondary/30 tracking-widest text-lg" 
                                                            placeholder="Card Number" 
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/60 w-5 h-5 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={cardExpiry}
                                                            onChange={(e) => setCardExpiry(e.target.value)}
                                                            className="w-full bg-bg-alt border border-primary/5 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary placeholder-secondary/30 text-center tracking-widest" 
                                                            placeholder="MM / YY" 
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-accent/60 w-5 h-5 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={cardCvv}
                                                            onChange={(e) => setCardCvv(e.target.value)}
                                                            className="w-full bg-bg-alt border border-primary/5 rounded-2xl pl-14 pr-6 py-5 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-light text-primary placeholder-secondary/30 text-center tracking-widest" 
                                                            placeholder="CVV" 
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {paymentMethod === 'stripe' && (
                                                <div className="bg-bg-alt rounded-2xl p-6 border border-primary/5 space-y-6">
                                                    <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                                                        <h4 className="font-heading font-medium text-lg text-primary">Stripe Secure Checkout</h4>
                                                        <span className="text-[9px] font-bold text-accent tracking-widest uppercase">Secured</span>
                                                    </div>

                                                    {isProcessingStripe ? (
                                                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                                            <Loader2 className="w-12 h-12 text-accent animate-spin" />
                                                            <p className="text-primary font-medium text-sm">Connecting to Stripe Checkout gateway...</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <p className="text-secondary text-sm font-light leading-relaxed">
                                                                Click below to proceed to Stripe's secure payment page. You will be able to complete your transaction using credit/debit card, Apple Pay, Google Pay, or other localized methods.
                                                            </p>
                                                            <div className="bg-white rounded-xl p-4 border border-primary/5 flex justify-between items-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] text-secondary font-medium uppercase tracking-widest leading-none mb-1">Total Price</span>
                                                                    <span className="text-xl font-heading font-semibold text-primary">${totalPrice.toFixed(2)}</span>
                                                                </div>
                                                                <span className="text-[9px] font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full uppercase tracking-wider">Ready</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {paymentMethod === 'whatsapp' && (
                                                <div className="bg-bg-alt rounded-2xl p-6 border border-primary/5 space-y-4">
                                                    <h4 className="font-heading font-medium text-lg text-primary">Instant Booking via WhatsApp</h4>
                                                    <p className="text-secondary text-sm font-light leading-relaxed">
                                                        Prefer to coordinate billing with a live agent? Click below to start a secure chat. We will format a direct invoice, handle currency exchanges, and secure your permits instantly.
                                                    </p>
                                                    <a
                                                        href="https://wa.me/97517609800"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#20ba5a] transition-colors"
                                                    >
                                                        💬 Start WhatsApp Conversation
                                                    </a>
                                                </div>
                                            )}

                                            {paymentMethod === 'offline' && (
                                                <div className="bg-bg-alt rounded-2xl p-6 border border-primary/5 space-y-4">
                                                    <h4 className="font-heading font-medium text-lg text-primary">Need bank transfer details?</h4>
                                                    <p className="text-secondary text-sm font-light leading-relaxed">
                                                        We support international bank wire transfers, offline deposits, and customized corporate billing protocols. Reach out to our Thimphu base for support:
                                                    </p>
                                                    <div className="pt-2 text-xs font-medium space-y-2 text-primary">
                                                        <p>📞 Phone: <span className="font-semibold text-accent">+975 2 334567</span></p>
                                                        <p>💬 WhatsApp: <span className="font-semibold text-accent">+975 17 609800</span></p>
                                                        <p>✉️ Email: <a href="mailto:explore@wandervista.bt" className="font-semibold text-accent underline">explore@wandervista.bt</a></p>
                                                    </div>
                                                </div>
                                            )}

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
                                            <span>Back</span>
                                        </button>
                                    ) : <div />}

                                    <button
                                        onClick={handleNext}
                                        className="btn-primary"
                                    >
                                        <span>{step === 3 ? (paymentMethod === 'card' ? 'Finalize Order' : paymentMethod === 'stripe' ? 'Pay with Stripe' : paymentMethod === 'whatsapp' ? 'Pay via WhatsApp' : 'Initiate Inquiry') : (step === 1 ? 'Proceed to Enhancements' : 'Proceed to Payment')}</span>
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Superior Order Sidebar (4 cols) */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-minimal border border-primary/5 overflow-hidden relative">
                                    <h3 className="text-2xl font-heading font-medium text-primary mb-8 tracking-wide">Expedition <span className="text-accent italic font-normal">Manifest</span></h3>

                                    <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-primary/5">
                                        <div className="w-full h-40 rounded-[2rem] overflow-hidden shadow-glass shrink-0 border border-primary/5">
                                            <img src={displayImage} className="w-full h-full object-cover hover:scale-105 transition-all duration-700" alt={displayTitle} />
                                        </div>
                                        <div>
                                            <h4 className="font-heading font-semibold text-xl text-primary leading-tight mb-2 tracking-wide">{displayTitle}</h4>
                                            <p className="text-[9px] font-medium text-accent uppercase tracking-[0.2em] flex items-center">
                                                <Zap className="w-3 h-3 mr-1" />
                                                Premium Private Slot
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {locationState ? (
                                            matchedTour ? (
                                                <>
                                                    <div className="flex justify-between items-center group">
                                                        <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">
                                                            Tour Package (x{locationState.adults || 2})
                                                        </span>
                                                        <span className="font-heading font-semibold text-primary tracking-wide">
                                                            ${(matchedTour.priceVal * (locationState.adults || 2)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center group">
                                                        <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">
                                                            Government SDF & Visa
                                                        </span>
                                                        <span className="font-heading font-semibold text-accent tracking-wide">
                                                            Included
                                                        </span>
                                                    </div>
                                                </>
                                            ) : matchedDestination ? (
                                                <>
                                                    <div className="flex justify-between items-center group">
                                                        <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">
                                                            Stay Cost ({locationState.nights || 1} Night{locationState.nights && locationState.nights > 1 ? 's' : ''} x {locationState.adults || 2} Guest{locationState.adults && locationState.adults > 1 ? 's' : ''})
                                                        </span>
                                                        <span className="font-heading font-semibold text-primary tracking-wide">
                                                            ${(locationState.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center group">
                                                        <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">
                                                            Government SDF Tax
                                                        </span>
                                                        <span className="font-heading font-semibold text-rose-500 tracking-wide">
                                                            Excluded
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-between items-center group">
                                                    <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">
                                                        Base Itinerary
                                                    </span>
                                                    <span className="font-heading font-semibold text-primary tracking-wide">
                                                        ${(locationState.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            )
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center group">
                                                    <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">Base Itinerary (x2)</span>
                                                    <span className="font-heading font-semibold text-primary tracking-wide">$1,798.00</span>
                                                </div>
                                                <div className="flex justify-between items-center group">
                                                    <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">SDF Government Tax</span>
                                                    <span className="font-heading font-semibold text-primary tracking-wide">$400.00</span>
                                                </div>
                                            </>
                                        )}
                                        {selectedAddons.map(addon => (
                                            <div key={addon} className="flex justify-between items-center group">
                                                <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">{addon}</span>
                                                <span className="font-heading font-semibold text-accent tracking-wide">+${addonPrices[addon]}.00</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center group">
                                            <span className="text-secondary font-light text-sm tracking-wide group-hover:text-primary transition-colors">Concierge Assistance</span>
                                            <span className="font-heading font-semibold text-accent tracking-wide">FREE</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-primary/10">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col gap-1">
                                                <span className="block text-[9px] font-medium text-secondary/60 uppercase tracking-[0.2em]">Grand Total / Total Price</span>
                                                <span className="text-3xl font-heading font-semibold text-primary tracking-tight">${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
