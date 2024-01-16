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
