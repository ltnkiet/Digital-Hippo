import React, { useState } from "react";
import { formatPrice, renderStar } from "utils/helpers";
import labelNew from "asset/img/LabelNew.png";
import labelTrending from "asset/img/LabelTrending.png";
import SelectOption from "../Search/SelectOption";
import {
  FaEye,
  FaCartPlus,
  BsFillCartCheckFill,
  BsFillSuitHeartFill,
} from "asset/icons";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import { apiUpdateCart, apiUpdateWishlist } from "api";
import Swal from "sweetalert2";
import { createSearchParams } from "react-router-dom";
import path from "utils/path";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { showModal } from "store/app/appSlice";
import { ProductDetail } from "page/public";
import { NavLink } from "react-router-dom";

const ProductCard = ({
  data,
  pid,
  isNew,
  normal,
  navigate,
  dispatch,
  location,
}) => {
  const { current, currentCart } = useSelector((state) => state.user);
  const [showOption, setShowOption] = useState(false);

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation();
    if (flag === "CART") {
      if (!current)
        return Swal.fire({
          title: "Khoan..",
          text: "Vui lòng đăng nhập!",
          icon: "info",
          showCancelButton: true,
          cancelButtonText: "Không phải bây giờ!",
          confirmButtonText: "Đăng nhập ngay",
        }).then(async (rs) => {
          if (rs.isConfirmed)
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
        });
      const response = await apiUpdateCart({
        pid: data?._id,
        color: data?.color,
        quantity: 1,
        price: data?.price,
        thumbnail: data?.thumb,
        title: data?.title,
      });
      if (response.success) {
        toast.success(response.msg);
        dispatch(getCurrent());
      } else toast.error(response.msg);
    }
    if (flag === "WISH_LIST") {
      if (!current)
        return Swal.fire({
          title: "Khoan..",
          text: "Vui lòng đăng nhập!",
          icon: "info",
          showCancelButton: true,
          cancelButtonText: "Không phải bây giờ!",
          confirmButtonText: "Đăng nhập ngay",
        }).then(async (rs) => {
          if (rs.isConfirmed)
            navigate({
              pathname: `/${path.LOGIN}`,
              search: createSearchParams({
                redirect: location.pathname,
              }).toString(),
            });
        });
      const response = await apiUpdateWishlist(pid);
      if (response.success) {
        toast.success(response.msg);
        dispatch(getCurrent());
      } else toast.error(response.msg);
    }
    if (flag === "QUICK_VIEW") {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <ProductDetail
              data={{ pid: data?._id, category: data?.category?.name }}
              isQuickView
            />
          ),
        })
      );
    }
  };

  return (
    <div className="mx-4 border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full max-w-xs bg-white">
        <div
          className="w-full relative"
          onMouseEnter={(e) => {
            e.stopPropagation();
            setShowOption(true);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setShowOption(false);
          }}>
          {!normal && (
            // eslint-disable-next-line
            <img
              src={isNew ? labelNew : labelTrending}
              className="absolute -top-1 -left-[8px] w-24 object-cover"
            />
          )}
          <img
            onClick={(e) =>
              navigate(`/${data?.category?.name}/${data?._id}/${data?.title}`)
            }
            className="p-5 rounded-t-lg object-contain w-[250px] h-[280px] hover:p-0"
            src={
              data?.thumb ||
              `https://res.cloudinary.com/ltnkiet/image/upload/v1701678798/DigitalHippo/thumb/quwxatr8sxviufr44np5.webp`
            }
            alt="Ảnh sản phẩm"
          />
          {showOption && (
            <div className="absolute flex justify-center bottom-2 left-0 right-0 gap-2 animate-slide-top">
              <span
                title="Quick view"
                onClick={(e) => handleClickOptions(e, "QUICK_VIEW")}>
                <SelectOption icon={<FaEye />} />
              </span>
              <span
                title="Add to Wishlist"
                onClick={(e) => handleClickOptions(e, "WISH_LIST")}>
                <SelectOption
                  icon={
                    <BsFillSuitHeartFill
                      color={
                        current?.wishlist?.some((i) => i._id === pid)
                          ? "red"
                          : "gray"
                      }
                    />
                  }
                />
              </span>
              {currentCart?.some(
                (el) => el.product?._id === data._id.toString()
              ) ? (
                <span title="Added to Cart">
                  <SelectOption icon={<BsFillCartCheckFill color="green" />} />
                </span>
              ) : (
                <span
                  title="Add to Cart"
                  onClick={(e) => handleClickOptions(e, "CART")}>
                  <SelectOption icon={<FaCartPlus />} />
                </span>
              )}
            </div>
          )}
        </div>
        <div className="px-5 pb-5">
          <div>
            <h5
              onClick={(e) =>
                navigate(`/${data?.category?.name}/${data?._id}/${data?.title}`)
              }
              className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white 
              line-clamp-1 cursor-pointer hover:text-main">
              {data?.title}
            </h5>
            <NavLink
              to={data?.category?.name}
              className="underline my-2 cursor-pointer hover:text-main">
              {data?.category?.name}
            </NavLink>
          </div>
          <div className="flex items-center justify-between mt-2.5 mb-5">
            {renderStar(data?.totalRating)}
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold mx-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {data?.totalRating}
            </span>
            <span className="text-xs">Đã bán {data?.sold}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(data?.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(ProductCard);
