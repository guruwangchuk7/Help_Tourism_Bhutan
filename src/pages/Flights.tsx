import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'

const flightHubs = [
  { from: "Bangkok (BKK)", to: "Paro (PBH)", frequency: "Daily Flights", duration: "3h 15m", carrier: "Drukair / Bhutan Airlines" },
  { from: "Delhi (DEL)", to: "Paro (PBH)", frequency: "4x per Week", duration: "2h 30m", carrier: "Drukair / Bhutan Airlines" },
  { from: "Singapore (SIN)", to: "Paro (PBH)", frequency: "2x per Week", duration: "5h 45m (via BKK)", carrier: "Drukair" },
  { from: "Kathmandu (KTM)", to: "Paro (PBH)", frequency: "3x per Week", duration: "1h 00m", carrier: "Drukair" }
]

const Flights = () => {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh] overflow-x-hidden">
        {/* Full Image Hero Banner */}
        <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-visible">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/dochula-pass.jpg"
              className="w-full h-full object-cover"
              alt="Bhutan Aviation Routes"
            />
            <div className="absolute inset-0 bg-black/45 z-10" />
          </div>

          {/* Hero Copy */}
          <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-32 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-[1.1] font-medium"
            >
              Bhutan <span className="text-accent italic font-normal">Flights</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-[10px] md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              Fly into the Kingdom of Happiness with our comprehensive flight concierge protocols
            </motion.p>
          </div>
        </section>

        {/* Flights Content */}
        <main className="max-w-5xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-heading font-medium text-primary mb-4">Airlines Entering the Kingdom</h2>
            <p className="text-secondary font-light leading-relaxed">
              Flying into Bhutan is a scenic adventure itself. Due to the unique valley terrain of Paro International Airport (PBH), only two airlines operate commercial flights into the country: **Drukair** (Royal Bhutan Airlines) and **Bhutan Airlines**.
            </p>
          </motion.div>

          {/* Route Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl p-8 border border-primary/5 shadow-minimal mb-16"
          >
            <h3 className="text-xl font-heading font-medium text-primary mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent" />
              Popular Direct Entry Sectors
            </h3>
            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary/5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                    <th className="py-4">From</th>
                    <th className="py-4">To</th>
                    <th className="py-4">Frequency</th>
                    <th className="py-4">Avg. Duration</th>
                    <th className="py-4">Carriers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5 text-sm font-light text-primary">
                  {flightHubs.map((route, i) => (
                    <tr key={i} className="hover:bg-bg-light/40 transition-colors">
                      <td className="py-4 font-medium">{route.from}</td>
                      <td className="py-4">{route.to}</td>
                      <td className="py-4 text-secondary">{route.frequency}</td>
                      <td className="py-4 text-secondary">{route.duration}</td>
                      <td className="py-4 font-medium text-accent">{route.carrier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked List (hidden on desktop) */}
            <div className="md:hidden space-y-6 divide-y divide-primary/5">
              {flightHubs.map((route, i) => (
                <div key={i} className={`${i > 0 ? 'pt-6' : ''} space-y-2.5`}>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-secondary">
                    <span>Route</span>
                    <span className="text-[10px] bg-bg-alt text-primary px-2 py-0.5 rounded-md font-bold">{route.frequency}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-primary">
                    <span className="font-semibold">{route.from}</span>
                    <span className="text-secondary/50">→</span>
                    <span className="font-semibold">{route.to}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-light text-secondary pt-1">
                    <div>
                      <span className="block text-[9px] font-bold uppercase text-secondary/40 tracking-wider mb-0.5">Duration</span>
                      <span className="text-primary">{route.duration}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold uppercase text-secondary/40 tracking-wider mb-0.5">Carrier</span>
                      <span className="text-accent font-medium">{route.carrier}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Inquiry Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white text-primary border border-primary/5 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-minimal"
          >
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <h3 className="text-2xl md:text-3xl font-heading font-medium mb-4">Flight Ticketing Concierge</h3>
              <p className="text-secondary text-sm mb-8 font-light leading-relaxed">
                As a fully certified travel agency, we handle Bhutan flight reservations, visa issuance, and local ticketing directly through our Thimphu base. Let us organize the optimal flight path for you.
              </p>
              <button
                onClick={() => navigate('/contact?type=flight')}
                className="btn-accent !px-8 !py-3.5 text-sm font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Inquire Flight Tickets
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  )
}

export default Flights
