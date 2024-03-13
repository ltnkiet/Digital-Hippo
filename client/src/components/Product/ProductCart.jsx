import React, { memo } from "react";
import withBaseComponent from "hocs/withBaseComponent";
import { useSelector } from "react-redux";
import { ButtonV2 } from "components";
import { AiFillCloseCircle, ImBin } from "asset/icons";
import { showCart } from "store/app/appSlice";
import { formatPrice } from "utils/helpers";
import { apiRemoveCart } from "api";
import { getCurrent } from "store/user/asyncActions";
import { toast } from "react-toastify";
import path from "utils/path";

const ProductCart = ({ dispatch, navigate }) => {
  const { currentCart } = useSelector((state) => state.user);

  const removeCart = async (pid, color) => {
    const response = await apiRemoveCart(pid, color);
    if (response.success) {
      dispatch(getCurrent());
    } else toast.error(response.msg);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-2/6 fixed h-screen bg-white grid grid-rows-10 text-black p-6">
      <header className="border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold text-2xl">
        <span>Giỏ hàng</span>
        <span
          onClick={() => dispatch(showCart())}
          className="p-2 cursor-pointer">
          <AiFillCloseCircle size={24} />
        </span>
      </header>
      <section className="row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3">
        {!currentCart && (
          <span className="text-xs italic">Your cart is empty.</span>
        )}
        {currentCart &&
          currentCart?.map((el) => (
            <div key={el._id} className="flex justify-between items-center">
              <div className="flex gap-2">
                <img
                  src={el.thumbnail}
                  alt="thumb"
                  className="w-16 h-16 object-cover"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-main">{el.title}</span>
                  <span className="text-[10px]">{el.color}</span>
                  <span className="text-[10px]">{`SL: ${el.quantity}`}</span>
                  <span className="text-sm">{formatPrice(el.price)}</span>
                </div>
              </div>
              <span
                onClick={() => removeCart(el.product?._id, el.color)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                <ImBin size={16} />
              </span>
            </div>
          ))}
      </section>
      <div className="row-span-2 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between pt-4 border-t">
          <span>Tổng tiền:</span>
          <span>
            {formatPrice(
              currentCart?.reduce(
                (sum, el) => sum + Number(el.price) * el.quantity,
                0
              )
            )}
          </span>
        </div>
        {/* <span className='text-center text-gray-700 italic text-xs'>Shipping, taxes, and discounts calculated at checkout.</span> */}
        <ButtonV2
          handleOnClick={() => {
            dispatch(showCart());
            navigate(`/${path.MEMBER}/${path.DETAIL_CART}`);
          }}
          style="rounded-none w-full bg-main py-3">
          Tiến hành thanh toán
        </ButtonV2>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(ProductCart));
