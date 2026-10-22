import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Heart,
  MapPin,
  Landmark,
  Sparkles,
  Mountain,
  Trees,
  Waves,
  Compass,
  Feather,
  Flower2,
  type LucideIcon
} from "lucide-react"
import { useState } from "react"

export type DestinationTag = {
  icon: LucideIcon
  label: string
}

type Props = {
  id: number
  name: string
  image: string
  location?: string
  price?: string
  showPrice?: boolean
  rating?: number
  groupSize?: string
  tags?: DestinationTag[]
}

const getDefaultTags = (id: number, name: string, location?: string): DestinationTag[] => {
  const query = `${name} ${location || ""}`.toLowerCase()

  if (query.includes("paro") || id === 2) {
    return [
      { icon: Sparkles, label: "Cultural Escape" },
      { icon: Landmark, label: "Heritage Sites" }
    ]
  }
  if (query.includes("thimphu") || id === 4) {
    return [
      { icon: Flower2, label: "Cultural Capital" },
      { icon: Landmark, label: "Heritage Sites" }
    ]
  }
  if (query.includes("punakha") || id === 1) {
    return [
      { icon: Landmark, label: "Historic Dzong" },
      { icon: Waves, label: "River Valley" }
    ]
  }
  if (query.includes("bumthang") || id === 6) {
    return [
      { icon: Sparkles, label: "Spiritual Heart" },
      { icon: Trees, label: "Alpine Valley" }
    ]
  }
  if (query.includes("phobjikha") || id === 5) {
    return [
      { icon: Feather, label: "Crane Sanctuary" },
      { icon: Trees, label: "Glacial Valley" }
    ]
  }
  if (query.includes("dochula") || id === 3) {
    return [
      { icon: Mountain, label: "Mountain Trek" },
      { icon: Landmark, label: "108 Chortens" }
    ]
  }
  if (query.includes("chele") || query.includes("pass")) {
    return [
      { icon: Mountain, label: "Mountain Trek" },
      { icon: Compass, label: "Adventure Trail" }
    ]
  }
  return [
    { icon: Sparkles, label: "Cultural Escape" },
    { icon: Landmark, label: "Heritage Sites" }
  ]
}

const DestinationCard = ({
  id,
  name,
  image,
  location = "Bhutan",
  price,
  showPrice = false,
  tags
}: Props) => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  const cardTags = tags && tags.length > 0 ? tags : getDefaultTags(id, name, location)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer h-full"
      onClick={() => navigate(`/destinations/${id}`)}
    >
      <div className="bg-white rounded-[1.75rem] p-3.5 border border-slate-200/80 shadow-minimal hover:shadow-premium transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
        {/* Framed Thumbnail Image (Clean without top badges) */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 pt-3.5 px-1 pb-1">
          {/* Destination Title */}
          <h3 className="text-base sm:text-lg font-heading font-semibold text-primary leading-snug group-hover:text-accent transition-colors truncate">
            {name}
          </h3>

          {/* Route / Location */}
          <div className="flex items-center gap-1.5 text-secondary text-xs mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-secondary/70 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Optional Price if explicitly requested */}
          {showPrice && price && (
            <div className="mb-3">
              <span className="text-xs text-secondary">Starting from </span>
              <span className="text-sm font-semibold text-primary">{price}</span>
            </div>
          )}

          {/* Category Tags with clean Lucide icons */}
          <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-2 mb-4">
            {cardTags.map((tag, idx) => {
              const Icon = tag.icon
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700 text-[11px] font-medium leading-none whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5 text-accent-dark/90 shrink-0" />
                  <span>{tag.label}</span>
                </span>
              )
            })}
          </div>

          {/* Bottom Action Row: Explore Trip + Heart Button */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/destinations/${id}`)
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-primary hover:text-white hover:border-primary text-primary font-medium text-xs tracking-wider uppercase flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer select-none"
            >
              Explore Trip
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              aria-label="Save to favorites"
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer select-none ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isFavorite ? "fill-current" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DestinationCard