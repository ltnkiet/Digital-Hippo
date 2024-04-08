import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { getCurrent } from "store/user/asyncActions";
import { clearMessage, logout } from "store/user/userSlice";
import { useSelector } from "react-redux";
import path from "utils/path";
import { Logo, Cart, NonUser, Wishlist } from "asset/img";
import { AiOutlineLogout, BiUserCircle } from "asset/icons";
import Swal from "sweetalert2";
import withBaseComponent from "hocs/withBaseComponent";
import { showCart } from "store/app/appSlice";

const Header = ({ dispatch, navigate }) => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const { isLoggedIn, current, msg } = useSelector((state) => state.user);

  useEffect(() => {
    const handleClickoutOptions = (e) => {
      const profile = document.getElementById("profile");
      if (!profile?.contains(e.target)) setIsShowMenu(false);
    };
    document.addEventListener("click", handleClickoutOptions);
    return () => {
      document.removeEventListener("click", handleClickoutOptions);
    };
  }, []);

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
      <form className="w-[50%]">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
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
      <div className="flex flex-row items-center justify-between gap-8 text-main">
        <div className="flex items-center cursor-pointer">
          <Fragment>
            {isLoggedIn && current ? (
              <div
                className="flex flex-row items-center gap-2 relative"
                onClick={() => setIsShowMenu((prev) => !prev)}
                id="profile">
                <img
                  src={current?.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"></img>
                <span className="font-medium hover:rounded-full hover:bg-gray-200 p-2">
                  {current?.name}
                </span>
                {isShowMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full flex-col flex mt-4 right-4 md:left-[16px] bg-white rounded-md border md:min-w-[200px] py-4 px-2">
                    <Link
                      className="p-2 w-full hover:rounded-full hover:bg-gray-200 flex items-center gap-2 px-4"
                      to={`/${path.MEMBER}`}>
                      <span>Trang cá nhân</span>
                      <BiUserCircle size={22} />
                    </Link>
                    {+current.role === 2 && (
                      <Link
                        className="p-2 w-full hover:rounded-full hover:bg-gray-200 px-4"
                        to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                        Trang quản trị
                      </Link>
                    )}
                    <span
                      onClick={() => dispatch(logout())}
                      className="hover:rounded-full hover:bg-gray-200 cursor-pointer hover:text-main p-2 flex items-center gap-2 px-4">
                      <span>Đăng xuất</span>
                      <AiOutlineLogout size={18} />
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <Link to={path.LOGIN}>
                <img src={NonUser} alt="" className="w-10" />
              </Link>
            )}
          </Fragment>
        </div>
        <div className="relative cursor-pointer">
          <img src={Wishlist} alt="" className="w-10" />
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-2 -right-3">
            <p className="text-white text-sm font-semibold">{current?.wishlist?.length || 0}</p>
          </div>
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => dispatch(showCart())}>
          <img src={Cart} alt="" className="w-10" />
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-2 -right-3">
            <p className="text-white font-semibold">
              {current?.cart?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(Header);
