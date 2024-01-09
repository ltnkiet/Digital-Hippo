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