import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Heart, MapPin } from "lucide-react"
import { useState } from "react"

type Props = {
  id: number
  name: string
  image: string
  location?: string
  price?: string
  rating?: number
}

const DestinationCard = ({ id, name, image, location = "Bhutan", price = "$120", rating = 4.8 }: Props) => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => navigate(`/destinations/${id}`)}
    >
      <div className="card-minimal relative flex flex-col h-full">
        {/* Thumbnail Image with Zoom Effect */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Heart Icon for Save/Favorite */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-primary hover:scale-110'
              }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Gradient Overlay for bottom text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Card Anatomy: Location, Rating, Price */}
        {/* Card Anatomy: Location, Rating, Price */}
        <div className="p-6 md:p-8 flex flex-col flex-1 bg-white">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2 text-accent">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]">{location}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 bg-bg-light px-2 py-1 rounded-md">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span className="text-xs font-bold text-primary">{rating}</span>
            </div>
          </div>

          <h3 className="text-2xl font-heading font-medium text-primary mt-2 mb-4 group-hover:text-accent transition-colors truncate pr-2">
            {name}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-6 border-t border-primary/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-secondary font-medium uppercase tracking-widest leading-none mb-2">Starting from</span>
              <span className="text-xl font-heading font-medium text-primary leading-none">
                {price} <span className="text-xs font-body font-normal text-secondary tracking-normal">/ night</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DestinationCard