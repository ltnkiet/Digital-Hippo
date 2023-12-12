import { FaRegStar, FaStar } from "../asset/icons";

export const createSlug = (string) => {
  return string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("_");
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
  for (let i = 0; i < +number; i++) star.push(<FaStar className="text-amber-400 text-lg" />);
  for (let i = 5; i > +number; i--) star.push(<FaRegStar className="text-amber-400 text-lg"/>);
  return star;
};
