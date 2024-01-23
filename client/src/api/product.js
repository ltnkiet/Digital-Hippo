import axios from "../axios";

export const apiGetProduct = (params) =>
  axios({
      url: "/product",
      method: "GET",
      params: params,
    });

export const apiGetProductDetail = (pid) =>
  axios({
      url: `/product/${pid}`,
      method: "GET",
    });

export const apiGetProductByCategory= (category) =>
  axios({
      url: `/product/category/${category}`,
      method: "GET",
    });
export const apiRatings = (data) =>
  axios({
    url: "/product/rating",
    method: "PUT",
    data,
  })
export const apiUpdateCart = (data) =>
  axios({
    url: "/user/cart",
    method: "PUT",
    data,
  })
export const apiRemoveCart = (pid, color) =>
  axios({
    url: `/user/cart/remove/${pid}/${color}`,
    method: "DELETE",
  })
export const apiUpdateWishlist = (pid) =>
  axios({
    url: `/user/wishlist/` + pid,
    method: "PUT",
  })
