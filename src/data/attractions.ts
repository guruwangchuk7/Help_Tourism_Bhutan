export type Attraction = {
  id: number
  name: string
  description: string
  image: string
}

export const attractions: Attraction[] = [
  {
    id: 1,
    name: "Punakha Suspension Bridge",
    description: "The longest suspension bridge in Bhutan with stunning views over the Mo Chhu River.",
    image: "/punakha-bridge.jpg"
  },
  {
    id: 2,
    name: "Dochula Pass Chortens",
    description: "108 memorial chortens set against panoramic Himalayan mountains.",
    image: "/dochula-chortens.jpg"
  },
  {
    id: 3,
    name: "Paro Valley Viewpoint",
    description: "Breathtaking view of Paro Valley and Tiger’s Nest Monastery.",
    image: "/paro-viewpoint.jpg"
  }
]