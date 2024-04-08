import axios from "../axios";

export const apiCreateProduct = (data) =>
  axios({
    url: "/product",
    method: "POST",
    data,
  });
export const apiGetProduct = (params) =>
  axios({
    url: "/product",
    method: "GET",
    params,
  });
export const apiGetProductDetail = (pid) =>
  axios({
    url: `/product/${pid}`,
    method: "GET",
  });
export const apiGetProductByCategory = (category) =>
  axios({
    url: `/product/category/${category}`,
    method: "GET",
  });
export const apiRatings = (data) =>
  axios({
    url: "/product/rating",
    method: "PUT",
    data,
  });
export const apiAddVarriant = (data, pid) =>
  axios({
    url: `/product/varriant/${pid}`,
    method: "PUT",
    data,
  });
export const apiUpdateProduct = (data, pid) =>
  axios({
    url: `/product/${pid}`,
    method: "PUT",
    data,
  })
export const apiDeleteProduct = (pid) =>
  axios({
    url: `/product/${pid}`,
    method: "DELETE",
  })
