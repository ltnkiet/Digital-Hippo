import React from "react";
import { formatPrice, formatTime } from "utils/helpers";
import { LogoV3 } from "asset/img";

const OrderDetail = ({ data }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      class="w-[60%] max-h-[675px] bg-white rounded-lg shadow-lg px-8 py-10 mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <img class="h-10 w-10 mr-2" src={LogoV3} alt="Logo" />
          <div class="text-gray-700 font-semibold text-lg">Digital Hippo</div>
        </div>
        <div class="text-gray-700">
          <div class="font-bold text-xl mb-2">Đơn hàng</div>
          <div class="text-sm">Ngày đặt: {formatTime(data?.createdAt)}</div>
          <div class="text-sm">Mã đơn: {data?._id}</div>
        </div>
      </div>
      <div class="border-b-2 border-gray-300 pb-8 mb-8">
        <h2 class="text-2xl font-bold mb-4">Khách hàng:</h2>
        <div class="text-gray-700 mb-2">Họ tên: {data?.orderBy?.name}</div>
        <div class="text-gray-700 mb-2">Email: {data?.orderBy?.email}</div>
        <div class="text-gray-700 mb-2">
          Số điện thoại: {data?.orderBy?.phone}
        </div>
        <div class="text-gray-700 mb-2">Địa chỉ: {data?.orderBy?.address}</div>
      </div>
      <table class="w-full text-left mb-8 mr-2">
        <thead>
          <tr>
            <th class="text-gray-700 font-bold uppercase py-2">Sản phẩm</th>
            <th class="text-gray-700 text-right font-bold uppercase py-2">Số lượng</th>
            <th class="text-gray-700 text-right font-bold uppercase py-2">Giá</th>
            <th class="text-gray-700 text-right font-bold uppercase py-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data?.products?.map((value) => (
            <tr key={value?._id}>
              <td class="py-4 text-gray-700">{value.title}</td>
              <td class="py-4 text-right text-gray-700">{value.quantity}</td>
              <td class="py-4 text-right text-gray-700">{formatPrice(value.price)}</td>
              <td class="py-4 text-right text-gray-700">
                {formatPrice(value.quantity * value.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data?.coupons && (
        <div class="text-right mb-8">
          <div class="text-gray-700 mr-2">Khuyến mãi:</div>
          <div class="text-gray-700">
            {data?.coupons?.name} (-{data?.coupons?.discount}%)
          </div>
        </div>
      )}
      <div class="flex items-center justify-end mb-8">
        <div class="text-gray-700 mr-2">Tổng tiền:</div>
        <div class="text-gray-700 font-bold text-xl">
          {formatPrice(data?.total * 24640)}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
