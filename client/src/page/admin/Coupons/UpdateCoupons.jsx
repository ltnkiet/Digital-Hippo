import { InputFormV2, ButtonV2, Loading } from "components";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { validate } from "utils/helpers";
import { toast } from "react-toastify";
import { apiUpdateCoupon } from "api";
import { showModal } from "store/app/appSlice";
import withBaseComponent from "hocs/withBaseComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatISO } from "date-fns";

const UpdateCoupons = ({ editCoupon, render, setEditCoupon, dispatch }) => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    reset({
      name: editCoupon?.name || "",
      discount: editCoupon?.discount || "",
      quantity: editCoupon?.quantity || "",
      startDate: editCoupon?.startDate || null,
      endDate: editCoupon?.endDate || null,
    });
  }, [editCoupon]);

  console.log(editCoupon);

  const handleUpdateCoupons = async (data) => {
    const invalids = validate(data, setInvalidFields);
    if (invalids === 0) {
      data.startDate = start ? formatISO(start) : null;
      data.endDate = end ? formatISO(end) : null;

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateCoupon(editCoupon._id, data);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      if (response.success) {
        toast.success(response.msg);
        render();
        setEditCoupon(null);
      } else toast.error(response.msg);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa</h1>
        <span
          className="bg-red-500 rounded-md p-2 font-medium text-white hover:underline cursor-pointer"
          onClick={() => setEditCoupon(null)}>
          Hủy
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateCoupons)}>
          <InputFormV2
            label="Tên khuyến mãi"
            register={register}
            errors={errors}
            id="name"
            validate
            placeholder="Nhập tên khuyến mãi"
          />
          <div className="w-full my-6 flex  gap-4">
            <InputFormV2
              label="Phần trăm giảm giá"
              register={register}
              errors={errors}
              id="discount"
              validate={{
                required: "Vui lòng điền phần trăm giảm giá",
                min: { value: 1, message: "Phần trăm giảm giá tối thiểu là 1" },
                max: {
                  value: 100,
                  message: "Phần trăm giảm giá tối đa là 100",
                },
                pattern: {
                  value: /^(?:[1-9]|[1-9][0-9]|100)$/,
                  message: "Phần trăm giảm giá không hợp lệ",
                },
              }}
              fullWidth
            />
            <InputFormV2
              label="Số lượng"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Vui lòng điền số lượng khuyến mãi",
                min: { value: 1, message: "Số lượng tối thiểu là 1" },
                max: {
                  value: 1000,
                  message: "Số lượng tối tối đa là 1000",
                },
                pattern: {
                  value: /^(?:[1-9]|[1-9][0-9][0-9]|1000)$/,
                  message: "Số lượng không hợp lệ",
                },
              }}
              fullWidth
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <DatePicker
              selected={start || editCoupon.startDate}
              onChange={(date) => setStart(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày bắt đầu"
            />
            <DatePicker
              selected={end || editCoupon.endDate}
              onChange={(date) => setEnd(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày kết thúc"
            />
          </div>
          <div className="my-6">
            <ButtonV2 type="submit">Xác nhận</ButtonV2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withBaseComponent(UpdateCoupons);
