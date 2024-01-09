import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
// Add a REQUEST interceptor
instance.interceptors.request.use(
  function (config) {
    let token =
      window.localStorage.getItem("persist:shop/user") &&
      JSON.parse(window.localStorage.getItem("persist:shop/user"))?.token?.slice(1, -1);
    config.headers = { authorization: token ? `Bearer ${token}` : null };
    return config;
    // const localStorageData = window.localStorage.getItem("persist:shop/user");
    // if (localStorageData && typeof localStorageData === "string") {
    //   localStorageData = JSON.parse(localStorageData);
    //   const accessToken = JSON.parse(localStorageData?.token);
    //   config.headers = { authorization: `Bearer ${accessToken}` };
    // } else return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// Add a RESPONSE interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error.response);
    // return error.response;
  }
);

export default instance;
