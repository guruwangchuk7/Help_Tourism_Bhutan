export type Tour = {
  id: number
  title: string
  duration: string
  price: string
  image: string
}

export const tours: Tour[] = [
  {
    id: 1,
    title: "Punakha & Paro 3-Day Tour",
    duration: "3 Days",
    price: "Nu.450",
    image: "/tour-punakha-paro.jpg"
  },
  {
    id: 2,
    title: "Thimphu Cultural Tour",
    duration: "2 Days",
    price: "Nu.300",
    image: "/tour-thimphu.jpg"
  },
  {
    id: 3,
    title: "Himalayan Scenic Tour",
    duration: "5 Days",
    price: "Nu.750",
    image: "/tour-himalayas.jpg"
  }
]