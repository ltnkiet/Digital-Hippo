import React, { useState } from "react";
import { formatPrice, renderStar } from "utils/helpers";
import labelNew from "asset/img/LabelNew.png";
import labelTrending from "asset/img/LabelTrending.png";
import SelectOption from "../Search/SelectOption";
import { FaEye, FaRegHeart, FaCartPlus, BsFillCartCheckFill  } from "asset/icons";
import withBaseComponent from "hocs/withBaseComponent";
import { apiUpdateCart } from "api";
import Swal from "sweetalert2";
import { createSearchParams } from "react-router-dom";
import { getCurrent } from "store/user/asyncActions";
import path from "utils/path";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductCard = ({ data, isNew, normal, navigate, dispatch, location }) => {
  const { current } = useSelector((state) => state.user);
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
  };

  return (
    <div className="mx-4 border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div
        class="w-full max-w-xs bg-white"
        onClick={(e) =>
          navigate(`/${data?.category?.name}/${data?._id}/${data?.title}`)
        }>
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
            <img
              src={isNew ? labelNew : labelTrending}
              className="absolute -top-1 -left-[8px] w-24 object-cover"
            />
          )}
          <img
            class="p-5 rounded-t-lg object-contain w-[250px] h-[280px] hover:p-0"
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
                onClick={(e) => handleClickOptions(e, "WISHLIST")}>
                <SelectOption icon={<FaRegHeart />} />
              </span>
              {current?.cart?.some(
                (el) => el.products?._id === data._id.toString()
              ) ? (
                <span title="Added to Cart">
                  <SelectOption icon={<BsFillCartCheckFill  color="green" />} />
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
        <div class="px-5 pb-5">
          <div>
            <h5 class="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-1">
              {data?.title}
            </h5>
            <div className="underline my-2 cursor-pointer hover:text-main">
              {data?.category?.name}
            </div>
          </div>
          <div class="flex items-center justify-between mt-2.5 mb-5">
            {renderStar(data?.totalRating)}
            <span class="bg-blue-100 text-blue-800 text-sm font-semibold mx-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {data?.totalRating}
            </span>
            <span className="text-xs">Đã bán {data?.sold}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(data?.price)}
            </span>
            {/* <p class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Giỏ hàng
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(ProductCard);
