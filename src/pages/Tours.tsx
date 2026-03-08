import { motion } from "framer-motion"
import { Compass, Zap, Shield, Heart, ArrowRight, CloudRain, Sun, Snowflake } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PageTransition from "../components/common/PageTransition"

const Tours = () => {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="pt-24 bg-bg-light min-h-screen border-t border-primary/5">
        {/* Luxury Intro */}
        <section className="py-24 px-6 md:py-40 relative flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-[2px] bg-accent mb-10" />
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-medium text-primary leading-[1] tracking-tight mb-10">
              Signature <br /> <span className="text-accent italic font-normal">Expeditions</span>
            </h1>
            <p className="max-w-xl text-secondary font-light text-xl mb-16 leading-relaxed tracking-wide">
              Limited-entry tours designed around festivals, royal traditions, and seasonal peaks.
            </p>
          </motion.div>

          {/* Filter Chips Placeholder */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['Cultural Festivals', 'Laya Gasa Trek', 'Royal Highland', 'Spirit of Bhutan'].map(tour => (
              <button key={tour} className="px-8 py-3 rounded-full bg-white border border-primary/5 shadow-minimal font-medium text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white hover:shadow-premium transition-all duration-300">
                {tour}
              </button>
            ))}
          </div>
        </section>

        {/* Seasonal Tours Grid */}
        <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {[
              { title: "The Paro Tshechu Edition", period: "Spring (March-May)", icon: Sun, color: "bg-primary/5", text: "text-primary", img: "/paro-taksang.jpg", price: "$3,499" },
              { title: "Snow Lion High Trek", period: "Summer (June-Aug)", icon: CloudRain, color: "bg-primary/5", text: "text-primary", img: "/monk.jpg", price: "$2,899" },
              { title: "Punakha Riverside Gala", period: "Fall (Sept-Nov)", icon: Heart, color: "bg-primary/5", text: "text-primary", img: "/punakha-dzong.jpg", price: "$4,199" },
              { title: "Black-Necked Crane Haven", period: "Winter (Dec-Feb)", icon: Snowflake, color: "bg-primary/5", text: "text-primary", img: "/dochula-pass.jpg", price: "$2,299" },
            ].map((tour, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-minimal hover:shadow-premium group border border-primary/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center transition-all duration-500"
              >
                <div className="w-full md:w-56 h-56 rounded-[2rem] overflow-hidden shrink-0 shadow-glass border border-primary/5">
                  <img src={tour.img} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt="" />
                </div>
                <div className="flex-1 w-full">
                  <div className={`inline-flex items-center space-x-2 ${tour.color} ${tour.text} px-4 py-2 rounded-full mb-6`}>
                    <tour.icon className="w-4 h-4" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] font-body">{tour.period}</span>
                  </div>
                  <h3 className="text-3xl font-heading font-medium text-primary leading-tight mb-4 tracking-wide">{tour.title}</h3>
                  <p className="text-secondary font-light mb-8 leading-relaxed text-sm tracking-wide">Experience Bhutan in its peak glory with exclusive access to local festivals.</p>

                  <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-medium text-secondary/60 uppercase tracking-[0.2em] mb-1">All-Inclusive</span>
                      <span className="text-2xl font-heading font-semibold text-primary">{tour.price}</span>
                    </div>
                    <button
                      onClick={() => navigate('/booking')}
                      className="w-12 h-12 bg-bg-alt text-primary rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-minimal group-hover:shadow-lg"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inclusion Section */}
        <section className="py-32 bg-primary px-6 rounded-t-[4rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/paro-taksang.jpg')] opacity-10 bg-cover bg-center grayscale mix-blend-overlay" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-24">
              <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-6 block">Our Standards</span>
              <h2 className="text-5xl md:text-7xl text-white font-heading font-medium tracking-tight leading-tight mb-8">What’s <span className="text-accent italic font-normal">Enveloped</span></h2>
              <p className="text-white/60 font-light max-w-xl mx-auto tracking-wide text-lg">Every expedition we curate includes the following premium protocols.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Shield, title: "Visa & Entry", desc: "Full handling of Bhutanese visa permits and SDF government taxes." },
                { icon: Compass, title: "Expert Guides", desc: "A personal heritage architect assigned to your journey from start to finish." },
                { icon: Zap, title: "Local Flights", desc: "Domestic transfers within the kingdom, ensuring zero logistical stress." },
              ].map((inc, i) => (
                <div key={i} className="glass-panel !bg-white/5 !border-white/10 p-12 rounded-[3rem] flex flex-col items-center text-center group hover:bg-white/10 transition-colors duration-500">
                  <div className="w-20 h-20 bg-accent/20 border border-accent/20 rounded-full flex items-center justify-center text-accent mb-10 group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                    <inc.icon className="w-8 h-8 transition-colors" />
                  </div>
                  <h4 className="text-xl font-heading font-medium text-white mb-6 tracking-wide">{inc.title}</h4>
                  <p className="text-white/60 font-light leading-relaxed tracking-wide text-sm">{inc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default Tours