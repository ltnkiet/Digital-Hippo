import React, { useState } from "react";
import { formatPrice, renderStar } from "utils/helpers";
import SelectOption from "../Search/SelectOption";
import {
  FaEye, BsFillSuitHeartFill,
  FaCartPlus,
  BsFillCartCheckFill,
} from "asset/icons";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import path from "utils/path";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { apiUpdateCart, apiUpdateWishlist } from "api";
import Swal from "sweetalert2";
import { createSearchParams } from "react-router-dom";
import { showModal } from "store/app/appSlice";
import { ProductDetail } from "page/public";

const ProductCardV2 = ({ data, location, dispatch, navigate, pid }) => {
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
          cancelButtonText: "Không phải bây giờ!",
          showCancelButton: true,
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
      const response = apiUpdateWishlist(pid);
      console.log(pid);
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
    <div
      className="w-full border flex flex-auto relative"
      onClick={(e) =>
        navigate(`/${data?.category?.name}/${data?._id}/${data?.title}`)
      }
      onMouseEnter={(e) => {
        e.stopPropagation();
        setShowOption(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setShowOption(false);
      }}>
      <img
        src={data?.thumb}
        alt=""
        className="w-[150px] object-contain p-4 hover:p-0"
      />
      <div className="flex flex-col py-4 gap-2">
        <p className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {data?.title}
        </p>
        <div className="flex items-center">
          {renderStar(data?.totalRating)}
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
            {data?.totalRating}
          </span>
        </div>
        <div>
          <span className="italic">{`{${data?.rating.length}}: lượt đánh giá`}</span>
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
          {formatPrice(data?.price)}
        </span>
      </div>
      {showOption && (
        <div className="absolute flex flex-col justify-center bottom-1 top-1 right-2 gap-2 animate-slide-right">
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
  );
};

export default withBaseComponent(ProductCardV2);
