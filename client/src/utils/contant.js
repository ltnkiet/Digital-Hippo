import path from "./path";
import {
  FaUserEdit,
  FaShoppingCart,
  FaHistory,
  FaHeartCirclePlus,
  MdSpaceDashboard,
  TbBrandProducthunt,
  MdGroups,
  RiBillLine,
  MdCategory,
  RiCoupon3Fill,
} from "asset/icons";

export const navigation = [
  {
    id: 1,
    value: "TRANG CHỦ",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "SẢN PHẨM",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "THƯƠNG HIỆU",
    path: `/${path.BRAND}`,
  },
  {
    id: 4,
    value: "VỀ CHÚNG TÔI",
    path: `/${path.ABOUT_US}`,
  },
];

export const footer = [
  {
    id: 1,
    value: "THÔNG TIN LIÊN HỆ",
  },
];

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
  "gold",
];

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
];

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
];

export const memberSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Thông tin cá nhân",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <FaUserEdit size={20} />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Giỏ hàng",
    path: `/${path.MEMBER}/${path.MY_CART}`,
    icon: <FaShoppingCart size={20} />,
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Lịch sử mua hàng",
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <FaHistory size={20} />,
  },
  {
    id: 40,
    type: "SINGLE",
    text: "Sản phẩm yêu thích",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <FaHeartCirclePlus size={20} />,
  },
];

export const adminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Thống kê",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <MdSpaceDashboard size={20} />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Đơn hàng",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <RiBillLine size={20} />,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Sản phẩm",
    icon: <TbBrandProducthunt size={20} />,
    submenu: [
      {
        text: "Danh sách",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
      {
        text: "Tạo sản phẩm",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 4,
    type: "PARENT",
    text: "Danh mục",
    icon: <MdCategory size={20} />,
    submenu: [
      {
        text: "Danh sách",
        path: `/${path.ADMIN}/${path.MANAGE_CATEGORY}`,
      },
      {
        text: "Tạo danh mục",
        path: `/${path.ADMIN}/${path.CREATE_CATEGORY}`,
      },
    ],
  },
  {
    id: 5,
    type: "PARENT",
    text: "Thương hiệu",
    icon: <MdCategory size={20} />,
    submenu: [
      {
        text: "Danh sách",
        path: `/${path.ADMIN}/${path.MANAGE_BRAND}`,
      },
      {
        text: "Tạo thương hiệu",
        path: `/${path.ADMIN}/${path.CREATE_BRAND}`,
      },
    ],
  },
  {
    id: 6,
    type: "PARENT",
    text: "Khuyến mãi",
    icon: <RiCoupon3Fill size={20} />,
    submenu: [
      {
        text: "Danh sách",
        path: `/${path.ADMIN}/${path.MANAGE_COUPON}`,
      },
      {
        text: "Tạo khuyến mãi",
        path: `/${path.ADMIN}/${path.CREATE_COUPON}`,
      },
    ],
  },
  {
    id: 10,
    type: "SINGLE",
    text: "Khách hàng",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <MdGroups size={20} />,
  },
];

export const roles = [
  {
    code: 0,
    value: "Khách",
  },
  {
    code: 1,
    value: "Nhân viên",
  },
  {
    code: 2,
    value: "Quản trị",
  },
];

export const blockStatus = [
  {
    code: true,
    value: "Khóa",
  },
  {
    code: false,
    value: "Mở",
  },
];

export const statusOrdersUser = [
  {
    value: "0",
    label: "Đã Hủy",
  },
  {
    value: "1",
    label: "Đang xử lý",
  },
  {
    value: "2",
    label: "Đang giao",
  },
  {
    value: "3",
    label: "Hoàn thành",
  },
];

export const statusTexts = ["Đã hủy", "Đang xử lý", "Đang giao", "Hoàn thành"];

export const statusColor = [
  "bg-red-600",
  "bg-gray-500",
  "bg-yellow-400",
  "bg-green-400",
];

export const getStatusClass = (status) => {
  switch (status) {
    case 0:
      return "bg-gray-200"; // Ẩn
    case 1:
      return "bg-green-200"; // Đang chạy
    case 2:
      return "bg-red-200"; // Đã dừng
    default:
      return "";
  }
};

export const imageSlider = {};
