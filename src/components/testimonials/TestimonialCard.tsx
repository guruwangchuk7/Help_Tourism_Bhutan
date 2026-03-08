type Props = {
  name: string
  comment: string
  rating: number
}

const TestimonialCard = ({ name, comment, rating }: Props) => {
  return (
    <div className="rounded-lg shadow-lg p-6 bg-white text-center">
      <p className="italic mb-2">"{comment}"</p>
      <div className="text-yellow-400 mb-2">
        {"★".repeat(rating) + "☆".repeat(5 - rating)}
      </div>
      <p className="font-semibold">{name}</p>
    </div>
  )
}

export default TestimonialCard