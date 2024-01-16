import React, { memo } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "asset/icons";

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
  return (
    <div className="flex items-center">
      <p
        onClick={() => handleChangeQuantity("minus")}
        className="p-2 cursor-pointer text-xl">
        <AiFillMinusCircle className="text-main"/>
      </p>
      <input
        className="py-2 border-main rounded-lg text-sm w-[40px] text-main text-center"
        type="text"
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value)}
      />
      <p
        onClick={() => handleChangeQuantity("plus")}
        className="p-2 cursor-pointer text-xl">
        <AiFillPlusCircle className="text-main"/>
      </p>
    </div>
  );
};

export default memo(SelectQuantity);
