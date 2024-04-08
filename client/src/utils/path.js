const path = {
  // Public
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "dang-nhap",
  REGISTER: "dang-ky/xac-thuc/:status",
  RESET_PASSWORD: "mat-khau/thay-doi/:token",
  PRODUCTS: "san-pham",
  PRODUCTS_DETAIL: "san-pham/:pid/:title",
  PRODUCTS_CATEGORY: ":category",
  PRODUCT_DETAIL__ID__TITLE: ":category/:pid/:title",
  ABOUT_US: "ve-chung-toi",
  BRAND: "thuong-hieu",
  CATEGORY: "danh-muc",
  DETAIL_CART: "gio-hang",
  CHECKOUT: "thanh-toan",
  // Admin
  ADMIN: "quan-tri",
  DASHBOARD: "thong-ke",
  MANAGE_USER: "khach-hang",
  MANAGE_ORDER: "don-hang",
  MANAGE_PRODUCTS: "san-pham",
  MANAGE_CATEGORY: "danh-muc",
  MANAGE_BRAND: "thuong-hieu",
  MANAGE_COUPON: 'khuyen-mai',
  CREATE_COUPON: "tao-khuyen-mai",
  CREATE_PRODUCTS: "tao-san-pham",
  CREATE_CATEGORY: "tao-danh-muc",
  CREATE_BRAND: "tao-thuong-hieu",
  // Member
  MEMBER: "khach-hang",
  PERSONAL: "thong-tin",
  MY_CART: "gio-hang",
  HISTORY: "don-hang/lich-su",
  WISHLIST: "yeu-thich",
};

export default path;
