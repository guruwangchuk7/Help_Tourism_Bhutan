import { motion } from "framer-motion"
import { Users, History, Award, Heart, ShieldCheck } from "lucide-react"
import PageTransition from "../components/common/PageTransition"

const About = () => {
  return (
    <PageTransition>
      <div className="pt-24 bg-white min-h-screen">
        {/* Hero */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <img src="/monk.jpg" className="absolute inset-0 w-full h-full object-cover" alt="About Bhutan" />
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
          <div className="relative z-10 text-center px-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-medium text-white tracking-tight leading-none mb-6">Our <span className="text-accent italic">Legacy</span></h1>
            <p className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">Founded in the heart of Thimphu, we are the bridge between the world and the Kingdom of Happiness.</p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-accent font-semibold uppercase tracking-[0.3em] text-[10px] mb-6 block">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-heading font-medium text-primary tracking-tight leading-none mb-10">Travel as a <br /> <span className="text-accent italic font-normal">Spiritual Act.</span></h2>
              <p className="text-secondary text-lg leading-relaxed font-light mb-10 tracking-wide">
                At WanderVista Bhutan, we believe travel shouldn't just change your location—it should change your perspective. We focus on "Deep Travel"—engaging with local communities, respecting sacred traditions, and ensuring every journey contributes to Bhutan's sustainable growth.
              </p>
              <div className="grid grid-cols-2 gap-10">
                {[
                  { label: "Founded", val: "2010" },
                  { label: "Guides", val: "50+ Local" },
                  { label: "Regions", val: "All 20 Dzongkhags" },
                  { label: "Happiness", val: "100% GNH" },
                ].map(stat => (
                  <div key={stat.label}>
                    <span className="block text-4xl font-heading font-medium text-primary mb-2">{stat.val}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-secondary/60">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-premium relative z-10 border border-primary/5">
                <img src="/paro-taksang.jpg" className="w-full h-full object-cover" alt="Heritage" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-bg-alt rounded-[2rem] -z-10 flex items-center justify-center text-primary/10 border border-primary/5">
                <History className="w-20 h-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-32 bg-bg-light px-6 border-t border-primary/5">
          <div className="max-w-7xl mx-auto text-center mb-24">
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-6 block">Our Standards</span>
            <h2 className="text-5xl font-heading font-medium text-primary tracking-tight mb-6">Built on <span className="italic font-normal text-accent">Integrity</span></h2>
            <p className="text-secondary font-light tracking-wide max-w-xl mx-auto">Four pillars that define every WanderVista experience.</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Users, title: "Community First", desc: "We ensure tourism dollars reach the remote families we visit." },
              { icon: Award, title: "Unmatched Expertise", desc: "Our guides are certified historians and cultural experts." },
              { icon: Heart, title: "Deep Vetting", desc: "Every hotel and lodge is personally tested for soul and quality." },
              { icon: ShieldCheck, title: "Ethical Impact", desc: "We are carbon-negative and plastic-free on all our treks." },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[2rem] shadow-minimal hover:shadow-premium transition-all duration-500 border border-primary/5 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-bg-alt rounded-full flex items-center justify-center text-primary mb-8 transition-transform duration-500 group-hover:bg-accent group-hover:text-white group-hover:scale-110">
                  <value.icon className="w-8 h-8 transition-colors" />
                </div>
                <h4 className="font-heading font-medium text-2xl mb-4 text-primary tracking-wide">{value.title}</h4>
                <p className="text-secondary font-light leading-relaxed tracking-wide text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default About