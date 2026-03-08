import { motion } from "framer-motion"
import { Sparkles, Mountain, Tent, Camera, Gem, Wind } from "lucide-react"

const categories = [
    { name: 'Adventure', icon: Mountain, count: 12 },
    { name: 'Cultural', icon: Sparkles, count: 8 },
    { name: 'Luxury', icon: Gem, count: 5 },
    { name: 'Trekking', icon: Tent, count: 15 },
    { name: 'Photography', icon: Camera, count: 6 },
    { name: 'Spiritual', icon: Wind, count: 10 },
]

const TravelCategories = () => {
    return (
        <section className="section-padding bg-white overflow-hidden border-y border-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24">
                    <span className="text-accent font-semibold tracking-[0.3em] uppercase text-[10px] mb-6 block">Explore By Experience</span>
                    <h2 className="text-5xl md:text-6xl font-heading font-medium tracking-tight text-primary mb-8">
                        Journey by <span className="italic font-normal">Intent</span>
                    </h2>
                    <p className="text-secondary text-lg font-light tracking-wide leading-relaxed max-w-xl mx-auto">
                        Choose your path based on what your soul seeks. Each category offers a unique perspective of Bhutan.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border border-primary/5 rounded-[2rem] overflow-hidden shadow-minimal bg-white">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ backgroundColor: '#FAFAFA' }}
                            className={`p-10 flex flex-col items-center text-center cursor-pointer transition-all border-r border-b lg:border-b-0 border-primary/5 last:border-r-0 group`}
                        >
                            <div className="p-4 rounded-full bg-bg-alt text-primary mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white group-hover:shadow-lg">
                                <cat.icon className="w-5 h-5 transition-colors" />
                            </div>
                            <h4 className="font-heading font-medium text-lg mb-2 text-primary tracking-wide">{cat.name}</h4>
                            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-secondary/60">
                                {cat.count} Options
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TravelCategories
