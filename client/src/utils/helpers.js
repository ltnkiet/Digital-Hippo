import { FaRegStar, FaStar, FaStarHalfAlt } from "../asset/icons";

export const createSlug = (string) => {
  return string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");
};

export const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const renderStar = (number) => {
  if (!Number(number)) return;
  const star = [];
  const fullStars = Math.floor(number);
  const hasHalfStar = number % 1 !== 0;
  for (let i = 0; i < fullStars; i++) star.push(<FaStar key={i} className="text-amber-400 text-lg" />);
  if (hasHalfStar) star.push(<FaStarHalfAlt key="half" className="text-amber-400 text-lg" />);
  for (let i = star.length; i < 5; i++) star.push(<FaRegStar key={i} className="text-amber-400 text-lg" />);
  return star;
};
