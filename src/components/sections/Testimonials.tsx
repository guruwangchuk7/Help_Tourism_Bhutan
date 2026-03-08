import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
    {
        id: 1,
        name: "Dr. Tashi Wangdi",
        role: "Cultural Historian",
        content: "The level of authenticity WanderVista brings to their itineraries is unparalleled. They don't just show you the Dzongs; they introduce you to the spirit and the building blocks of Bhutan.",
        avatar: "https://i.pravatar.cc/200?u=bhutan1"
    },
    {
        id: 2,
        name: "Jameson Brooks",
        role: "Visual Artist",
        content: "Lighting is everything. My guide was so well-trained that he knew the exact minute the sun would hit the Tiger's Nest waterfall for that perfect frame. Truly exceptional local knowledge.",
        avatar: "https://i.pravatar.cc/200?u=photog"
    },
    {
        id: 3,
        name: "Anya Petrova",
        role: "Solo Traveler",
        content: "Safety and soul. These are the two things I found. As a solo female traveler, I felt completely protected and spiritually recharged. The homestays were the highlight of my life.",
        avatar: "https://i.pravatar.cc/200?u=anya"
    }
]

const Testimonials = () => {
    return (
        <section className="section-padding px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <span className="text-primary font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block">Voice of the Valley</span>
                    <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tight leading-none text-primary">
                        The World’s <span className="italic font-normal">Seekers</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col h-full bg-[#FAFAFA] p-12 rounded-3xl group"
                        >
                            <Quote className="w-10 h-10 text-primary/10 mb-10 group-hover:text-accent transition-colors duration-500" />

                            <p className="text-secondary text-lg font-light tracking-wide leading-relaxed mb-12 flex-1">
                                "{t.content}"
                            </p>

                            <div className="mt-auto flex items-center space-x-4 pt-8 border-t border-primary/5">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                <div className="flex flex-col">
                                    <h4 className="font-heading font-semibold text-primary text-base mb-1 tracking-wide">{t.name}</h4>
                                    <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-secondary/60">{t.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
