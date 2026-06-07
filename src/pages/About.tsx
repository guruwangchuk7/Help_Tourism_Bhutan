import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Users, History, Award, Heart, ShieldCheck } from "lucide-react"
import PageTransition from "../components/common/PageTransition"
import SEO from "../components/common/SEO"

import { PageSkeleton } from "../components/common/Skeleton"

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

const defaultAboutData: AboutData = {
  philosophyText: "At Help Tourism Bhutan, we believe travel shouldn't just change your location—it should change your perspective. We focus on \"Deep Travel\"—engaging with local communities, respecting sacred traditions, and ensuring every journey contributes to Bhutan's sustainable growth.",
  stat1Label: "Founded",
  stat1Val: "2010",
  stat2Label: "Guides",
  stat2Val: "50+ Local",
  stat3Label: "Regions",
  stat3Val: "All 20 Dzongkhags",
  stat4Label: "Happiness",
  stat4Val: "100% GNH",
  pillar1Title: "Community First",
  pillar1Desc: "We ensure tourism dollars reach the remote families we visit.",
  pillar2Title: "Unmatched Expertise",
  pillar2Desc: "Our guides are certified historians and cultural experts.",
  pillar3Title: "Deep Vetting",
  pillar3Desc: "Every hotel and lodge is personally tested for soul and quality.",
  pillar4Title: "Ethical Impact",
  pillar4Desc: "We are carbon-negative and plastic-free on all our treks."
}

const About = () => {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/about`)
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        console.warn("Failed to fetch about data, using local fallback:", err)
        setData(defaultAboutData)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return <PageSkeleton cardCount={4} />
  }

  const aboutSchema = useMemo(() => {
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
            "name": "About Us",
            "item": "https://www.helptourbhutan.com/about"
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Help Tourism Bhutan",
        "description": "Learn about our agency's legacy, commitment to sustainable tourism, carbon-negative guidelines, local expert guides, and high-value travel principles in Bhutan.",
        "mainEntity": {
          "@type": "TravelAgency",
          "name": "Help Tourism Bhutan",
          "url": "https://www.helptourbhutan.com/"
        }
      }
    ]
  }, [])

  return (
    <PageTransition>
      <div className="bg-bg-light min-h-[100dvh]">
        <SEO
          title="About Us | Local Expert Tour Operator in Bhutan"
          description="Meet Help Tourism Bhutan, a premier local travel agency and tour operator. Discover our commitment to sustainable tourism, carbon-negative travels, and custom luxury itineraries."
          keywords="About Bhutan travel agency, local tour operator Bhutan, sustainable tourism Bhutan, expert Bhutan guides, team Help Tourism Bhutan"
          ogImage="/monk.jpg"
          schema={aboutSchema}
        />
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
              className="text-white/80 text-[10px] md:text-sm font-light max-w-2xl mx-auto leading-relaxed tracking-[0.15em] uppercase"
            >
              Founded in the heart of Thimphu, we are the bridge between the world and the Kingdom of Happiness.
            </motion.p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-16 sm:py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center"
          >
            <div>
              <span className="text-accent font-semibold uppercase tracking-[0.3em] text-[10px] mb-4 sm:mb-6 block">Our Philosophy</span>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-heading font-medium text-primary tracking-tight leading-none mb-6 sm:mb-10">Travel as a <br /> <span className="text-accent italic font-normal">Spiritual Act.</span></h2>
              <p className="text-secondary text-base sm:text-lg leading-relaxed font-light mb-8 sm:mb-10 tracking-wide">
                {data.philosophyText}
              </p>
              <div className="grid grid-cols-2 gap-6 sm:gap-10">
                {[
                  { label: data.stat1Label, val: data.stat1Val },
                  { label: data.stat2Label, val: data.stat2Val },
                  { label: data.stat3Label, val: data.stat3Val },
                  { label: data.stat4Label, val: data.stat4Val },
                ].map(stat => (
                  <div key={stat.label}>
                    <span className="block text-3xl sm:text-4xl font-heading font-medium text-primary mb-2">{stat.val}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-secondary/60">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-10 lg:mt-0">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-premium relative z-10 border border-primary/5">
                <img src="/paro-taksang.jpg" className="w-full h-full object-cover" alt="Heritage" />
              </div>
              <div className="hidden sm:flex absolute -bottom-10 -left-10 w-64 h-64 bg-bg-alt rounded-[2rem] -z-10 items-center justify-center text-primary/10 border border-primary/5">
                <History className="w-20 h-20" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Values */}
        <section className="py-16 sm:py-24 md:py-32 bg-bg-light px-6 border-t border-primary/5">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto text-center mb-16 sm:mb-24"
          >
            <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-4 sm:mb-6 block">Our Standards</span>
            <h2 className="text-3xl sm:text-5xl font-heading font-medium text-primary tracking-tight mb-6">Built on <span className="italic font-normal text-accent">Integrity</span></h2>
            <p className="text-secondary font-light tracking-wide max-w-xl mx-auto">Four pillars that define every Help Tourism Bhutan experience.</p>
          </motion.div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[
              { icon: Users, title: data.pillar1Title, desc: data.pillar1Desc },
              { icon: Award, title: data.pillar2Title, desc: data.pillar2Desc },
              { icon: Heart, title: data.pillar3Title, desc: data.pillar3Desc },
              { icon: ShieldCheck, title: data.pillar4Title, desc: data.pillar4Desc },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-6 sm:p-12 rounded-[2rem] shadow-minimal hover:shadow-premium transition-all duration-500 border border-primary/5 flex flex-col items-center text-center group"
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