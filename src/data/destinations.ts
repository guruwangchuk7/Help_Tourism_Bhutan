export type Destination = {
  id: number
  name: string
  image: string
  description: string
  attractions: string[]
  price: string
  rating: number
  location: string
}

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Punakha Dzong",
    image: "/punakha-dzong.jpg",
    description:
      "Punakha Dzong is one of Bhutan's most majestic fortresses and the winter capital of the Drukpa Lineage. It offers stunning architecture, riverside views, and a rich historical experience.",
    attractions: [
      "Punakha Suspension Bridge",
      "Chimi Lhakhang (Fertility Temple)",
      "Dzong’s Courtyard"
    ],
    price: "$120",
    rating: 4.8,
    location: "Punakha"
  },
  {
    id: 2,
    name: "Paro Taktsang",
    image: "/paro-taksang.jpg",
    description:
      "Also known as Tiger’s Nest Monastery, Paro Taktsang clings to a cliff 900 meters above the Paro Valley. It is Bhutan's most iconic pilgrimage site with breathtaking views.",
    attractions: [
      "Meditation caves",
      "Viewpoints of the valley",
      "Monastery murals and temples"
    ],
    price: "$150",
    rating: 4.9,
    location: "Paro"
  },
  {
    id: 3,
    name: "Dochula Pass",
    image: "/dochula-pass.jpg",
    description:
      "Dochula Pass features 108 memorial chortens set against panoramic Himalayan mountains. It's an excellent spot for photography and scenic drives.",
    attractions: [
      "108 Druk Wangyal Chortens",
      "Coffee shops with mountain views",
      "Nearby hiking trails"
    ],
    price: "$95",
    rating: 4.7,
    location: "Thimphu"
  },
  {
    id: 4,
    name: "Thimphu Valley",
    image: "/thimphu.jpg",
    description: "The capital city of Bhutan, Thimphu is a unique blend of modern development and ancient traditions, being the only capital in the world without traffic lights.",
    attractions: ["Buddha Dordenma", "Memorial Chorten", "Tashichho Dzong"],
    price: "$110",
    rating: 4.6,
    location: "Thimphu"
  },
  {
    id: 5,
    name: "Phobjikha Valley",
    image: "/monk.jpg",
    description: "A vast U-shaped glacial valley, famous as the winter home of the rare black-necked cranes that migrate from the Tibetan Plateau.",
    attractions: ["Gangtey Monastery", "Crane Information Centre", "Nature Trails"],
    price: "$130",
    rating: 4.8,
    location: "Wangdue Phodrang"
  },
  {
    id: 6,
    name: "Bumthang Valley",
    image: "/airport.jpg",
    description: "The spiritual heartland of Bhutan, Bumthang is home to some of the country's oldest and most sacred Buddhist temples and monasteries.",
    attractions: ["Kurje Lhakhang", "Jambay Lhakhang", "Jakar Dzong"],
    price: "$140",
    rating: 4.9,
    location: "Bumthang"
  }
]