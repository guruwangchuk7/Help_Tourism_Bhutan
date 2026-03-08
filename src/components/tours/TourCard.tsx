import React from "react"

type Props = {
  title: string
  duration: string
  price: string
  image: string
}

const TourCard: React.FC<Props> = ({ title, duration, price, image }) => (
  <div className="rounded-lg overflow-hidden shadow-lg bg-white max-w-sm mx-auto hover:scale-105 transition-transform duration-300">
    <div className="h-64 w-full">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-1">{duration}</p>
      <p className="text-orange-600 font-bold">{price}</p>
    </div>
  </div>
)

export default TourCard