import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, History, Award, Heart, ShieldCheck } from "lucide-react"
import PageTransition from "../components/common/PageTransition"

type AboutData = {
  philosophyText: string
  stat1Label: string
  stat1Val: string
  stat2Label: string
  stat2Val: string
  stat3Label: string
  stat3Val: string
  stat4Label: string
  stat4Val: string
  pillar1Title: string
  pillar1Desc: string
  pillar2Title: string
  pillar2Desc: string
  pillar3Title: string
  pillar3Desc: string
  pillar4Title: string
  pillar4Desc: string
}

const About = () => {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/about`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return (
      <div className="p-40 text-center min-h-[100dvh] bg-bg-light text-2xl font-heading font-medium text-primary animate-pulse">
        Loading About Details...
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh]">
        {/* Full Image Hero Banner */}
        <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-visible">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/monk.jpg"
              className="w-full h-full object-cover"
              alt="About Bhutan"
            />
            <div className="absolute inset-0 bg-black/45 z-10" />
          </div>

          {/* Hero Copy */}
          <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-32 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-[1.1] font-medium"
            >
              Our <span className="text-accent italic font-normal">Legacy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-white/80 text-xs md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              Founded in the heart of Thimphu, we are the bridge between the world and the Kingdom of Happiness.
            </motion.p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-accent font-semibold uppercase tracking-[0.3em] text-[10px] mb-6 block">Our Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-heading font-medium text-primary tracking-tight leading-none mb-10">Travel as a <br /> <span className="text-accent italic font-normal">Spiritual Act.</span></h2>
              <p className="text-secondary text-lg leading-relaxed font-light mb-10 tracking-wide">
                {data.philosophyText}
              </p>
              <div className="grid grid-cols-2 gap-10">
                {[
                  { label: data.stat1Label, val: data.stat1Val },
                  { label: data.stat2Label, val: data.stat2Val },
                  { label: data.stat3Label, val: data.stat3Val },
                  { label: data.stat4Label, val: data.stat4Val },
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
              <div className="hidden sm:flex absolute -bottom-10 -left-10 w-64 h-64 bg-bg-alt rounded-[2rem] -z-10 items-center justify-center text-primary/10 border border-primary/5">
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
            <p className="text-secondary font-light tracking-wide max-w-xl mx-auto">Four pillars that define every Help Tourism Bhutan experience.</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Users, title: data.pillar1Title, desc: data.pillar1Desc },
              { icon: Award, title: data.pillar2Title, desc: data.pillar2Desc },
              { icon: Heart, title: data.pillar3Title, desc: data.pillar3Desc },
              { icon: ShieldCheck, title: data.pillar4Title, desc: data.pillar4Desc },
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