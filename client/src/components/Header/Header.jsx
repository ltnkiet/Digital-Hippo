import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrent } from "store/user/asyncActions";
import { clearMessage, logout } from "store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import path from "utils/path";
import { Logo } from "asset/img";
import { MdShoppingCart, FaUserCircle, BsFillHeartFill, MdOutlineLibraryBooks, AiOutlineLogout, IoMdArrowDropdown } from "asset/icons";
import Swal from "sweetalert2";

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShowMenu, setIsShowMenu] = useState(false);


  const { isLoggedIn, current, msg } = useSelector((state) => state.user);

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 1000);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (msg)
      Swal.fire("Sự cố", msg, "info").then(() => {
        dispatch(clearMessage());
        navigate(`/${path.LOGIN}`);
      });
  }, [msg]);
  
  return (
    <div className="w-main flex justify-between items-center">
      <Link to={`/${path.HOME}`}>
        <img src={Logo} alt="" className="h-32" />
      </Link>
      {/* <form className="w-[60%]">
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
      </form> */}
      <div className="flex flex-row items-center justify-between gap-8 text-main">
        <div className="flex items-center cursor-pointer">
          {isLoggedIn && current ? (
              <div className="flex flex-row items-center gap-2">
                <img src={current?.avatar} alt="" className="w-10 rounded-full"></img>
                <span className="font-medium">Chào {current?.name}</span>
                <span
                  onClick={() => dispatch(logout())}
                  className="hover:rounded-full hover:bg-gray-200 cursor-pointer hover:text-main p-2"
                >
                  <AiOutlineLogout size={18} />
                </span>
              </div>
          ) : (
            <Link to={path.LOGIN}>
              <FaUserCircle className="w-8 h-8" />
            </Link>
          )}
        </div>
        <div className="relative cursor-pointer">
          <BsFillHeartFill className="text-2xl cursor-pointer w-8" />
          {/* <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-3 -right-4">
            <p className="text-white text-sm font-semibold">1</p>
          </div> */}
        </div>
        <div className="relative cursor-pointer">
          <MdShoppingCart className="text-2xl cursor-pointer w-8 h-8" />
          {/* <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-2 -right-3">
            <p className="text-white text-sm font-semibold">2</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
