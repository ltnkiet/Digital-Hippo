import { FaRegStar, FaStar, FaStarHalfAlt } from "asset/icons";

export const createSlug = (string) => {
  return string
    .toUpperCase()
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

export const generateRange = (start, end) => {
  const length = end + 1 - start
  return Array.from({ length }, (_, index) => start + index)
}

export const validate = (payload, setInvalidFields) => {
  let invalids = 0;
  let fields = Object.entries(payload);
  fields.forEach((item) => {
    if (item[1] === "") {
      setInvalidFields((prev) => [
        ...prev,
        {
          name: item[0],
          message: "Bạn không được bỏ trống trường này.",
        },
      ]);
      invalids++;
    }
  });
  fields.forEach((item) => {
    switch (item[0]) {
      case "password":
        if (item[1].length < 8) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Mật khẩu phải có tối thiểu 8 kí tự.",
            },
          ]);
          invalids++;
        }
        break;
      case "confirmPass":
        if (item[1].length < 8) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Mật khẩu phải có tối thiểu 8 kí tự.",
            },
          ]);
          invalids++;
        } else if (item[1] !== payload.password) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Mật khẩu không khớp.",
            },
          ]);
          invalids++;
        }
        break;
      default:
        break;
      case "phone":
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(item[1])) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Số điện thoại không hợp lệ. Phải đủ 10 hoặc 11 số",
            },
          ]);
          invalids++;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(item[1])) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Email không hợp lệ.",
            },
          ]);
          invalids++;
        }
        break;
      case "priceNumber":
      case "areaNumber":
        if (+item[1] === 0) {
          setInvalidFields((prev) => [...prev,
            {
              name: item[0],
              message: "Vui lòng đặt giá trị cho trường này.",
            },
          ]);
          invalids++;
        }
        if (!+item[1]) {
          setInvalidFields((prev) => [...prev,
            {
              name: item[0],
              message: "Vui lòng nhập số.",
            },
          ]);
          invalids++;
        }
        break;
    }
  });
  return invalids;
};
export default validate

