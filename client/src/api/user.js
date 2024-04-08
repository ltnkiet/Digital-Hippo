import axios from "../axios";

export const apiRegister = (data) =>
  axios({
    url: "/user/register",
    method: "POST",
    data,
    withCredentials: true,
  });
export const apiLogin = (data) =>
  axios({
    url: "/user/login",
    method: "POST",
    data,
  });
export const apiForgotPassword = (email) =>
  axios({
    url: "/user/password/forgot",
    method: "POST",
    data: email,
  });
export const apiResetPassword = (data) =>
  axios({
    url: "/user/password/reset",
    method: "PUT",
    data,
  });
export const apiGetCurrent = () =>
  axios({
    url: "/user/current",
    method: "GET",
  });
export const apiUpdateCurrent = (data) =>
  axios({
    url: "/user/current",
    method: "PUT",
    data,
  });
export const apiGetUsers = (params) =>
  axios({
    url: "/user/",
    method: "GET",
    params,
  });
export const apiUpdateUser = (data, uid) =>
  axios({
    url: `/user/admin/update/${uid}`,
    method: "PUT",
    data,
  });
export const apiDeleteUser = (uid) =>
  axios({
    url: "/user/" + uid,
    method: "DELETE",
  });
export const apiUpdateCart = (data) =>
  axios({
    url: "/user/cart",
    method: "PUT",
    data,
  });
export const apiRemoveCart = (pid, color) =>
  axios({
    url: `/user/cart/remove/${pid}/${color}`,
    method: "DELETE",
  });
export const apiUpdateWishlist = (pid) =>
  axios({
    url: `/user/wishlist/${pid}`,
    method: "PUT",
  });
