import React, { useEffect, useState } from "react";
import { Payment } from "asset/img";
import { useSelector } from "react-redux";
import { formatPrice } from "utils/helpers";
import { Congrat, PayPal, Select } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import Swal from "sweetalert2";
import { apiCreateOrder, apiGetCoupons } from "api";
import path from "utils/path";
import { toast } from "react-toastify";

const CheckOut = ({ dispatch, navigate }) => {
  const { currentCart, current } = useSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchCoupons = async (params) => {
      const response = await apiGetCoupons({
        ...params,
        limit: process.env.REACT_APP_LIMIT,
        status: 1,
      });
      if (response.success) {
        setCoupons(response.coupons);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (currentCart.length <= 0 && !checkoutCompleted) {
      Swal.fire({
        icon: "warning",
        title: "Giỏ hàng trống",
        text: "Vui lòng chọn mặt hàng trước khi thanh toán",
      }).then(() => {
        navigate("/");
      });
    }
  }, [currentCart, checkoutCompleted]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getCurrent());
      setCheckoutCompleted(true);
    }
  }, [isSuccess]);

  const totalBeforeDiscount = currentCart.reduce(
    (sum, el) => +el?.price * el.quantity + sum,
    0
  );

  const selectedCouponData = coupons.find(
    (coupon) => coupon._id === selectedCoupon
  );
  const discountPercentage = selectedCouponData
    ? selectedCouponData.discount
    : 0;
  const discountValue = totalBeforeDiscount * (discountPercentage / 100);
  const totalAfterDiscount = totalBeforeDiscount - discountValue;

  useEffect(() => {
    if (paymentMethod === "OFFLINE") {
      const total = totalAfterDiscount;
      Swal.fire({
        icon: "info",
        title: "Thanh toán",
        text: `Vui lòng trả bằng tiền mặt số tiền 
          ${formatPrice(total)} khi nhận hàng.`,
        showConfirmButton: true,
        confirmButtonText: "Thanh toán",
        showCancelButton: true,
        cancelButtonText: "Quay lại",
      }).then((result) => {
        if (result.isConfirmed) {
          handleSaveOrder();
        } else {
          setPaymentMethod("");
        }
      });
    }
  }, [paymentMethod]);

  const handleSaveOrder = async () => {
    const payload = {
      products: currentCart,
      address: current?.address,
      coupons: selectedCoupon,
      total: totalAfterDiscount / 24640,
    };
    const response = await apiCreateOrder({ ...payload, status: 1 });
    if (response.success) {
      setIsSuccess(true);
      setTimeout(() => {
        Swal.fire("Hoàn tất", "Đặt hàng thành công.", "success").then(() => {
          navigate(`/${path.MEMBER}/${path.HISTORY}`);
        });
      }, 1500);
    } else toast.error(response.msg);

    console.log(response)
  };

  return (
    <div className="p-8 w-full grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6">
      {isSuccess && <Congrat />}
      <div className="w-full flex justify-center items-center col-span-4">
        <img src={Payment} alt="" className="h-[70%] object-contain" />
      </div>
      <div className="flex w-full flex-col justify-center col-span-6 gap-6">
        <h2 className="text-3xl mb-6 font-bold">Thanh toán đơn hàng</h2>
        <div className="w-full flex flex-col gap-6">
          <div className="flex-1">
            <table className="table-auto w-full h-fit">
              <thead>
                <tr className="border bg-gray-200">
                  <th className="p-2 text-left"></th>
                  <th className="p-2 text-left">Sản phẩm</th>
                  <th className="text-center p-2">SL</th>
                  <th className="text-right p-2">Giá</th>
                </tr>
              </thead>
              <tbody>
                {currentCart?.map((el) => (
                  <tr className="border" key={el?._id}>
                    <td className="text-left p-2">
                      <div className="w-20 h-20">
                        <img
                          src={el?.thumbnail}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="text-left p-2">{el?.title}</td>
                    <td className="text-center p-2">{el?.quantity}</td>
                    <td className="text-right p-2">{formatPrice(el?.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-[45px]">
            <div className="flex flex-col gap-6">
              <span className="flex items-center gap-8 text-sm">
                <span className="font-medium">Tổng tiền:</span>
                <span className="text-main font-bold">
                  {formatPrice(totalAfterDiscount)}
                  {/* {formatPrice(
                    currentCart?.reduce(
                      (sum, el) => +el?.price * el.quantity + sum,
                      0
                    )
                  )} */}
                </span>
              </span>
              <span className="flex items-center gap-8 text-sm">
                <span className="font-medium">Địa chỉ:</span>
                <span className="text-main font-bold">{current?.address}</span>
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span>Mã khuyến mãi: </span>
                <select
                  onChange={(e) => setSelectedCoupon(e.target.value)}
                  value={selectedCoupon}
                  className="border rounded-md px-4 py-3 w-[30%]">
                  <option value="">Chọn</option>
                  {coupons?.map((value) => (
                    <option key={value._id} value={value._id}>
                      {value.name} (giảm {value.discount}%)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span>Phương thức thanh toán: </span>
                <select
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                  className="border rounded-md px-4 py-3 w-[30%]">
                  <option value="">Chọn</option>
                  <option value="OFFLINE">Thanh toán khi nhận hàng</option>
                  <option value="ONLINE">Thanh toán Paypal</option>
                </select>
              </div>
            </div>
            {paymentMethod === "ONLINE" && (
              <div className="w-full mx-auto">
                <PayPal
                  payload={{
                    products: currentCart,
                    total:
                      +currentCart?.reduce(
                        (sum, el) => +el?.price * el.quantity + sum,
                        0
                      ) / 24640,
                    address: current?.address,
                  }}
                  setIsSuccess={setIsSuccess}
                  amount={
                    +currentCart?.reduce(
                      (sum, el) => +el?.price * el.quantity + sum,
                      0
                    ) / 24640
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(CheckOut);
