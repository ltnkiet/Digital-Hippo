import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add a REQUEST interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a RESPONSE interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) { 
  return error.data;
});

export default instance