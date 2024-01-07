import axios from "../axios";

export const apiRegister = (data) => axios(
  {
    url: "/user/register",
    method: "POST",
    data
  }
);

