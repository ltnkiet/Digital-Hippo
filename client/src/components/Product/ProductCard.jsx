import React, { useState } from "react";
import { formatPrice, renderStar } from "../../utils/helpers";
import labelNew from "../../asset/img/LabelNew.png";
import labelTrending from "../../asset/img/LabelTrending.png";
import SelectOption from "./SelectOption";
import { FaEye, FaRegHeart } from "../../asset/icons";

const ProductCard = ({ data, isNew, pid }) => {
  const [showOption, setShowOption] = useState(false);
  return (
    <div className="mx-4">
      <div class="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
          <img
            src={isNew ? labelNew : labelTrending}
            className="absolute -top-1 -left-[8px] w-24 object-cover"
          />
          <img
            class="p-5 rounded-t-lg object-contain w-[250px] h-[280px] hover:p-0"
            src={
              data?.thumb ||
              `https://res.cloudinary.com/ltnkiet/image/upload/v1701678798/DigitalHippo/thumb/quwxatr8sxviufr44np5.webp`
            }
            alt="Ảnh sản phẩm"
          />
          {showOption && (
            <div className="absolute flex justify-center bottom-1 left-0 right-0 gap-2 animate-slide-top">
              <SelectOption icon={<FaEye />} />
              <SelectOption icon={<FaRegHeart />} />
            </div>
          )}
        </div>
        <div class="px-5 pb-5">
          <div>
            <h5 class="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white h-[48px] line-clamp-2">
              {data?.title}
            </h5>
            <div className="underline my-2 cursor-pointer hover:text-main">{data?.category?.name}</div>
          </div>
          <div class="flex items-center mt-2.5 mb-5">
            {renderStar(data?.totalRating)}
            <span class="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {data?.totalRating}
            </span>
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

export default ProductCard;
