import { Compass, Plane } from 'lucide-react'
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
      <div className="pt-24 bg-bg-light min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
          <img
            src="/dochula-pass.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
            alt="Bhutan Aviation Routes"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-light via-transparent to-black/25" />

          <div className="relative z-10 text-center px-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full mb-4 border border-white/20">
              <Plane className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Royal Skies</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-medium text-white tracking-tight">
              Bhutan Flights
            </h1>
          </div>
        </section>

        {/* Flights Content */}
        <main className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-heading font-medium text-primary mb-4">Airlines Entering the Kingdom</h2>
            <p className="text-secondary font-light leading-relaxed">
              Flying into Bhutan is a scenic adventure itself. Due to the unique valley terrain of Paro International Airport (PBH), only two airlines operate commercial flights into the country: **Drukair** (Royal Bhutan Airlines) and **Bhutan Airlines**.
            </p>
          </div>

          {/* Route Table */}
          <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-minimal mb-16">
            <h3 className="text-xl font-heading font-medium text-primary mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-accent" />
              Popular Direct Entry Sectors
            </h3>
            <div className="overflow-x-auto">
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
          </div>

          {/* Inquiry Section */}
          <div className="bg-primary text-white rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-premium">
            <div className="absolute inset-0 bg-[url('/paro-taksang.jpg')] opacity-10 bg-cover bg-center grayscale mix-blend-overlay" />
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <h3 className="text-2xl md:text-3xl font-heading font-medium mb-4">Flight Ticketing Concierge</h3>
              <p className="text-white/70 text-sm mb-8 font-light leading-relaxed">
                As a fully certified travel agency, we handle Bhutan flight reservations, visa issuance, and local ticketing directly through our Thimphu base. Let us organize the optimal flight path for you.
              </p>
              <button
                onClick={() => navigate('/booking')}
                className="btn-accent !px-8 !py-3.5 text-sm font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Inquire Flight Tickets
              </button>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

export default Flights
