import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

type TestimonialItem = {
    id: number
    name: string
    role: string
    content: string
    avatar: string
    rating: number
}

const Testimonials = () => {
    const [list, setList] = useState<TestimonialItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/testimonials`)
            .then(res => res.json())
            .then(data => {
                setList(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load testimonials:", err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="py-24 text-center text-secondary font-light animate-pulse">
                Loading Voice of the Valley...
            </div>
        )
    }

    return (
        <section className="section-padding px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <span className="text-primary font-semibold tracking-[0.4em] uppercase text-[10px] mb-8 block">Voice of the Valley</span>
                    <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tight leading-none text-primary">
                        Customer <span className="italic font-normal">Reviews</span>
                    </h2>
                </div>

                <div className="flex md:grid flex-row md:grid-cols-3 gap-6 md:gap-16 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide">
                    {list.slice(0, 3).map((t, idx) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col h-full bg-[#FAFAFA] p-6 md:p-12 rounded-3xl group w-[85%] md:w-auto shrink-0 snap-center"
                        >
                            <div className="flex items-center gap-1 mb-6 md:mb-8">
                                {[...Array(t.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                                ))}
                            </div>

                            <p className="text-secondary text-sm md:text-lg font-light tracking-wide leading-relaxed mb-6 md:mb-12 flex-1 italic">
                                "{t.content}"
                            </p>

                            <div className="mt-auto flex items-center space-x-4 pt-6 md:pt-8 border-t border-primary/5">
                                <img src={t.avatar || "https://i.pravatar.cc/200"} alt={t.name} className="w-12 h-12 rounded-full object-cover shadow-minimal transition-transform duration-500 group-hover:scale-105" />
                                <div className="flex flex-col">
                                    <h4 className="font-heading font-semibold text-primary text-sm md:text-base mb-1 tracking-wide">{t.name}</h4>
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

