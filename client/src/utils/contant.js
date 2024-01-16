import path from "./path"
export const navigation = [
  {
    id: 1,
    value: "TRANG CHỦ",
    path: `/${path.HOME}`
  },
  {
    id: 2,
    value: "SẢN PHẨM",
    path: `/${path.PRODUCTS}`
  },
  {
    id: 3,
    value: "THƯƠNG HIỆU",
    path: `/${path.BRAND}`
  },
  {
    id: 4,
    value: "VỀ CHÚNG TÔI",
    path: `/${path.ABOUT_US}`
  },
]

export const footer = [
  {
    id: 1,
    value: "THÔNG TIN LIÊN HỆ"
  }
]

export const colors = [
  "black",
  "brown",
  "gray",
  "white",
  "pink",
  "yellow",
  "orange",
  "purple",
  "green",
  "blue",
  "gold"
]

export const sorts = [
  {
    id: 1,
    value: "-sold",
    text: "Bán chạy nhất",
  },
  {
    id: 4,
    value: "-price",
    text: "Từ cao đến thấp",
  },
  {
    id: 5,
    value: "price",
    text: "Từ thấp đến cao",
  },
  {
    id: 6,
    value: "-createdAt",
    text: "Mới nhất",
  },
  {
    id: 7,
    value: "createdAt",
    text: "Cũ nhất",
  },
]

export const voteOptions = [
  {
    id: 1,
    text: "Rất tệ",
  },
  {
    id: 2,
    text: "Tệ",
  },
  {
    id: 3,
    text: "Tạm ổn",
  },

  {
    id: 4,
    text: "Tốt",
  },

  {
    id: 5,
    text: "Rất tốt",
  },
]