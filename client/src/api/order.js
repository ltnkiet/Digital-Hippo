import axios from "../axios";

export const apiCreateOrder = (data) =>
  axios({
    url: "/order/",
    method: "POST",
    data,
  })
export const apiGetOrders = (params) =>
  axios({
    url: "/order/admin",
    method: "GET",
    params,
  })
export const apiGetUserOrders = (params) =>
  axios({
    url: "/order/",
    method: "GET",
    params,
  })
export const apiUpdateStatus = (oid, data) =>
  axios({
    url: "/order/admin/status/" + oid,
    method: "PUT",
    data,
  })