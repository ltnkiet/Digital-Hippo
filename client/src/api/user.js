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
