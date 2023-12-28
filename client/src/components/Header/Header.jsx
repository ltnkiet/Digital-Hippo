import React from "react";
import { Link } from "react-router-dom";

import path from "../../utils/path";

import Logo from "../../asset/img/logo.png";
import {
  MdShoppingCart,
  FaUserCircle,
  BsFillHeartFill,
} from "../../asset/icons";

const Header = () => {
  return (
    <div className="w-main flex justify-between items-center ">
      <Link to={`/${path.HOME}`}>
        <img src={Logo} alt="" className="h-32" />
      </Link>
      <form className="w-[60%]">
        <label
          for="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-main dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
            placeholder="Tìm sản phẩm..."></input>
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-main focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
            Tìm
          </button>
        </div>
      </form>
      <div className="flex flex-row items-center justify-between gap-8">
        <div className="relative cursor-pointer">
          <BsFillHeartFill className="text-textColor text-2xl cursor-pointer w-7 h-7" />
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-3 -right-4">
            <p className="text-white text-sm font-semibold">1</p>
          </div>
        </div>
        <div className="relative cursor-pointer">
          <MdShoppingCart className="text-textColor text-2xl cursor-pointer w-8 h-8" />
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-3 -right-3">
            <p className="text-white text-sm font-semibold">2</p>
          </div>
        </div>
        <Link to={path.LOGIN} className="flex flex-col items-center cursor-pointer">
          <FaUserCircle className="w-7 h-7 text-textColor" />
          <span>Tài khoản</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
