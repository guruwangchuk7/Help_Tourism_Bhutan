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
                            className="flex flex-col h-full bg-[#FAFAFA] p-6 md:p-12 rounded-3xl group w-[280px] md:w-auto shrink-0 snap-center"
                        >
                            <div className="flex items-center gap-1 mb-6 md:mb-8">
                                {[...Array(t.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                                ))}
                            </div>

                            <span className="text-secondary text-xs md:text-lg font-light tracking-wide leading-relaxed mb-4 md:mb-12 flex-1 italic block">
                                "{t.content}"
                            </span>

                            <div className="mt-auto flex items-center space-x-3 pt-4 md:pt-8 border-t border-primary/5">
                                <img src={t.avatar || "https://i.pravatar.cc/200"} alt={t.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-minimal transition-transform duration-500 group-hover:scale-105" />
                                <div className="flex flex-col">
                                    <span className="font-heading font-semibold text-primary text-xs md:text-base mb-0.5 tracking-wide block">{t.name}</span>
                                    <span className="text-[9px] md:text-[11px] font-light text-secondary/60 leading-tight block tracking-normal mt-0.5">{t.role}</span>
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

