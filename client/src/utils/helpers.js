import { FaRegStar, FaStar, FaStarHalfAlt } from "asset/icons";
import moment from "moment";
import "moment/locale/vi";

export const formatTime = (time) => {
  return moment(time).format("llll");
};

export const formatTimeV2 = (time) => {
  return moment(time).format("l");
};

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
  for (let i = 0; i < fullStars; i++)
    star.push(<FaStar key={i} className="text-amber-400 text-lg" />);
  if (hasHalfStar)
    star.push(<FaStarHalfAlt key="half" className="text-amber-400 text-lg" />);
  for (let i = star.length; i < 5; i++)
    star.push(<FaRegStar key={i} className="text-amber-400 text-lg" />);
  return star;
};

export const generateRange = (start, end) => {
  const length = end + 1 - start;
  return Array.from({ length }, (_, index) => start + index);
};

export function getBase64(file) {
  if (!file) return "";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
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
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Vui lòng đặt giá trị cho trường này.",
            },
          ]);
          invalids++;
        }
        if (!+item[1]) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Vui lòng nhập số.",
            },
          ]);
          invalids++;
        }
        break;
      case "quantity":
        if (parseInt(item[1]) <= 0) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Số lượng phải lớn hơn 0.",
            },
          ]);
          invalids++;
        }
        break;
      case "discount":
        const discountValue = parseFloat(item[1]);
        if (!discountValue || discountValue <= 0 || discountValue > 100) {
          setInvalidFields((prev) => [
            ...prev,
            {
              name: item[0],
              message: "Phần trăm giảm giá phải từ 1 đến 100.",
            },
          ]);
          invalids++;
        }
        break;
    }
  });
  return invalids;
};
export default validate;

export function getDaysInMonth(customTime, number) {
  const endDay = new Date(customTime)?.getDate() || new Date().getDate();
  const days = number || 15;
  const endPreviousMonth = new Date(
    new Date(customTime)?.getFullYear(),
    new Date(customTime)?.getMonth(),
    0
  ).getDate();
  let day = 1;
  let prevDayStart = 1;
  const daysInMonths = [];
  while (prevDayStart <= +endPreviousMonth) {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    daysInMonths.push(
      `${year}-${month < 10 ? `0${month}` : month}-${
        prevDayStart < 10 ? "0" + prevDayStart : prevDayStart
      }`
    );
    prevDayStart += 1;
  }
  while (day <= +endDay) {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    daysInMonths.push(
      `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? "0" + day : day
      }`
    );
    day += 1;
  }
  return daysInMonths.filter(
    (el, index, self) => index > self.length - days - 2
  );
}
export function getMonthInYear(customTime, number) {
  const endMonth =
    new Date(customTime?.to).getMonth() + 1 || new Date().getMonth() + 1;
  let month = 1;
  const months = number || 8;
  let startLastYear = 1;
  const daysInMonths = [];
  while (startLastYear <= 12) {
    const year = new Date().getFullYear();
    daysInMonths.push(
      `${year - 1}-${startLastYear < 10 ? `0${startLastYear}` : startLastYear}`
    );
    startLastYear += 1;
  }
  while (month <= +endMonth) {
    const year = new Date().getFullYear();
    daysInMonths.push(`${year}-${month < 10 ? `0${month}` : month}`);
    month += 1;
  }
  return daysInMonths.filter(
    (el, index, self) => index > self.length - months - 2
  );
}
export const getDaysInRange = (start, end) => {
  const startDateTime = new Date(start).getTime();
  const endDateTime = new Date(end).getTime();
  return (endDateTime - startDateTime) / (24 * 60 * 60 * 1000);
};
export const getMonthsInRange = (start, end) => {
  let months;
  const d1 = new Date(start);
  const d2 = new Date(end);
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};
