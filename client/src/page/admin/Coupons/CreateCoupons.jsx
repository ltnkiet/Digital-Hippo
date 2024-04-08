import React, { useState } from "react";
import { InputFormV2, ButtonV2, Loading } from "components";
import { useForm } from "react-hook-form";
import { validate } from "utils/helpers";
import { toast } from "react-toastify";
import { apiCreateCoupons } from "api";
import { showModal } from "store/app/appSlice";
import withBaseComponent from "hocs/withBaseComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatISO } from "date-fns";

const CreateCoupons = ({ dispatch }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  // eslint-disable-next-line
  const [invalidFields, setInvalidFields] = useState([]);

  const handleCreateCoupons = async (data) => {
    data.startDate = formatISO(start);
    data.endDate = formatISO(end);
    const invalids = validate(data, setInvalidFields);
    if (invalids === 0) {
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateCoupons(data);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        toast.success(response.msg);
        reset();
      } else toast.error(response.msg);
    }
  };

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Tạo khuyến mãi</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateCoupons)}>
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
              selected={start}
              onChange={(date) => setStart(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày bắt đầu"
              reset
            />
            <DatePicker
              selected={end}
              onChange={(date) => setEnd(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày kết thúc"
              reset
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

export default withBaseComponent(CreateCoupons);
