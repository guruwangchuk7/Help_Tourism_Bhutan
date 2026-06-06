import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Skeleton } from "../common/Skeleton"
import avatarElena from "../../assets/avatar-elena.png"
import avatarMarcus from "../../assets/avatar-marcus.png"
import avatarUser from "../../assets/avatar-user.png"

type TestimonialItem = {
    id: number
    name: string
    role: string
    content: string
    avatar: string
    rating: number
}

const getLocalAvatar = (avatarUrl: string, name: string) => {
    const url = avatarUrl || "";
    if (url.includes("elena") || name.toLowerCase().includes("elena")) return avatarElena;
    if (url.includes("marcus") || name.toLowerCase().includes("marcus")) return avatarMarcus;
    return avatarUser;
}

const Testimonials = () => {
    const [list, setList] = useState<TestimonialItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/testimonials`)
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
            <section className="section-padding bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <Skeleton className="h-3 w-24 mx-auto mb-2" />
                        <Skeleton className="h-10 w-48 mx-auto rounded-lg" />
                    </div>
                </div>
                {/* 3 card skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col bg-[#FAFAFA] p-8 rounded-3xl space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex items-center gap-3 pt-5 border-t border-primary/5">
                                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-3.5 w-1/3" />
                                    <Skeleton className="h-2.5 w-1/4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    return (
        <section className="section-padding bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Heading */}
                <div className="text-center mb-8 sm:mb-12">
                    <span className="text-primary font-semibold tracking-[0.4em] uppercase text-[9px] mb-2 block">Voice of the Valley</span>
                    <h2 className="text-2xl sm:text-4xl md:text-6xl font-heading font-medium tracking-tight leading-tight text-primary">
                        Customer <span className="italic font-normal">Reviews</span>
                    </h2>
                </div>
            </div>

            {/* Mobile: horizontal scroll | md+: 3-col grid */}
            <div className="md:hidden flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                {list.slice(0, 3).map((t, _idx) => (
                    <div
                        key={t.id}
                        className="flex flex-col bg-[#FAFAFA] p-4 rounded-2xl shrink-0 w-[240px] snap-start"
                    >
                        <div className="flex items-center gap-0.5 mb-2">
                            {[...Array(t.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-accent fill-accent" />
                            ))}
                        </div>
                        <p className="text-secondary text-xs font-light leading-relaxed mb-3 flex-1 italic line-clamp-4">
                            &ldquo;{t.content}&rdquo;
                        </p>
                        <div className="flex items-center gap-2 pt-3 border-t border-primary/5">
                            <img
                                src={getLocalAvatar(t.avatar, t.name)}
                                alt={t.name}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div>
                                <span className="font-heading font-semibold text-primary text-[11px] block">{t.name}</span>
                                <span className="text-[9px] font-light text-secondary/50 block">{t.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: 3-column grid */}
            <div className="hidden md:grid grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
                {list.slice(0, 3).map((t, idx) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col bg-[#FAFAFA] p-8 rounded-3xl"
                    >
                        <div className="flex items-center gap-1 mb-5">
                            {[...Array(t.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                            ))}
                        </div>
                        <p className="text-secondary text-sm font-light leading-relaxed mb-8 flex-1 italic">
                            &ldquo;{t.content}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-5 border-t border-primary/5">
                            <img
                                src={getLocalAvatar(t.avatar, t.name)}
                                alt={t.name}
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                            <div>
                                <span className="font-heading font-semibold text-primary text-sm block">{t.name}</span>
                                <span className="text-[11px] font-light text-secondary/60 block mt-0.5">{t.role}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Testimonials

