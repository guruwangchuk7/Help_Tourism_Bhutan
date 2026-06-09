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
      "Punakha Dzong, also known as Pungtang Dechen Phodrang ('Palace of Great Happiness'), is the second oldest and most majestic dzong in Bhutan. Built in 1637 at the scenic confluence of the Pho Chhu and Mo Chhu rivers, it serves as the winter home of the central clergy. It houses sacred relics and serves as a vital historical monument, famous for its intricate woodwork and defensive design. In spring, blooming lilac jacaranda trees frame its whitewashed walls, making it one of Bhutan's most photogenic and spiritual locations.",
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
      "Paro Taktsang, famously known as the Tiger’s Nest, is a sacred Buddhist monastery perched precariously on a cliffside 900 meters above the Paro Valley. Established in 1692 around the cave where Guru Rinpoche is said to have meditated, this iconic landmark offers breathtaking views, ancient murals, and a profound spiritual atmosphere reached via a scenic, rewarding pine-forest hike.",
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
      "Dochula Pass is a breathtaking mountain pass situated at 3,100 meters on the road from Thimphu to Punakha. It is renowned for its panoramic 360-degree views of the snow-capped Himalayan range and the 108 beautiful memorial chortens (shrines) built in honor of fallen soldiers, making it a peaceful, spiritually inspiring stop.",
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
    description:
      "Thimphu Valley houses the unique capital of Bhutan, blending modern expansion with deep-rooted cultural values. Surrounded by green hills, it features the grand Tashichho Dzong, the massive Buddha Dordenma overlooking the valley, and traditional museums, all without a single traffic light in the entire city.",
    attractions: ["Buddha Dordenma", "Memorial Chorten", "Tashichho Dzong"],
    price: "$110",
    rating: 4.6,
    location: "Thimphu"
  },
  {
    id: 5,
    name: "Phobjikha Valley",
    image: "/monk.jpg",
    description:
      "Phobjikha Valley is a stunning, wide glacial valley situated on the slopes of the Black Mountains. Renowned for its natural beauty and peaceful atmosphere, it is famous as the winter nesting ground of the rare, endangered black-necked cranes. The historic Gangtey Monastery overlooks this vast, scenic wetland.",
    attractions: ["Gangtey Monastery", "Crane Information Centre", "Nature Trails"],
    price: "$130",
    rating: 4.8,
    location: "Wangdue Phodrang"
  },
  {
    id: 6,
    name: "Bumthang Valley",
    image: "/airport.jpg",
    description:
      "Bumthang Valley is the spiritual heartland of Bhutan, consisting of four high-altitude valleys rich in ancient legend, sacred temples, and historic monasteries. As the birthplace of many Buddhist saints and home to Kurjey and Jambay Lhakhang, it offers deep historical walks, local cheese farms, and untouched alpine beauty.",
    attractions: ["Kurje Lhakhang", "Jambay Lhakhang", "Jakar Dzong"],
    price: "$140",
    rating: 4.9,
    location: "Bumthang"
  }
]