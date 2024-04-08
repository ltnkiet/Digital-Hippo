import axios from "../axios";

// Category
export const apiCreateCategory = (data) =>
  axios({
    url: "/category",
    method: "POST",
    data,
  });
export const apiGetCategory = (params) =>
  axios({
    url: "/category",
    method: "GET",
    params,
  });
export const apiUpdateCategory = (id, data) =>
  axios({
    url: `/category/${id}`,
    method: "PUT",
    data,
  });
export const apiDeleteCategory = (id) =>
  axios({
    url: `/category/${id}`,
    method: "DELETE",
  });

// Brand
export const apiCreateBrand = (data) =>
  axios({
    url: "/brand",
    method: "POST",
    data,
  });
export const apiGetBrand = (params) =>
  axios({
    url: "/brand",
    method: "GET",
    params,
  });
export const apiUpdateBrand = (bid, data) =>
  axios({
    url: `/brand/${bid}`,
    method: "PUT",
    data,
  });
export const apiDeleteBrand = (bid) =>
  axios({
    url: `/brand/${bid}`,
    method: "DELETE",
  });

// Dashboard
export const apiGetDashboard = (params) =>
  axios({
    url: "/order/admin/dashboard",
    method: "GET",
    params,
  });

// Coupons
export const apiCreateCoupons = (data) =>
  axios({
    url: "/coupons",
    method: "POST",
    data,
  });
export const apiGetCoupons = (params) =>
  axios({
    url: "/coupons",
    method: "GET",
    params,
  });
export const apiUpdateCoupon = (cid, data) =>
  axios({
    url: `/coupons/${cid}`,
    method: "PUT",
    data,
  });
export const apiDeleteCoupons = (cid) =>
  axios({
    url: `/coupons/${cid}`,
    method: "DELETE",
  });
