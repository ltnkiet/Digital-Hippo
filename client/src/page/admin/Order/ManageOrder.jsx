import React, { useCallback, useEffect, useState } from "react";
import { apiGetOrders, apiUpdateStatus } from "api";
import { ButtonV2, Pagination, InputFormV2 } from "components";
import useDebounce from "hooks/useDebounce";
import { useForm } from "react-hook-form";
import { BiEdit, FaEye } from "asset/icons";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { showModal } from 'store/app/appSlice'
import { formatPrice, formatTime } from "utils/helpers";
import { statusTexts, statusColor } from "utils/contant";
import withBaseComponent from "hocs/withBaseComponent";
import OrderDetail from "page/member/OrderDetail";

const ManageOrder = ({ navigate, location, dispatch }) => {
  const [params] = useSearchParams();
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const [orders, setOrders] = useState();
  const [counts, setCounts] = useState(0);
  const [update, setUpdate] = useState(false);
  const [editOrder, setEditOrder] = useState();

  const fetchOrders = async (params) => {
    const response = await apiGetOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.counts);
      setOrders(response.orderList);
    }
  };
  const render = useCallback(() => {
    setUpdate(!update);
  });
  const queryDecounce = useDebounce(watch("q"), 800);
  useEffect(() => {
    if (queryDecounce) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ q: queryDecounce }).toString(),
      });
    } else
      navigate({
        pathname: location.pathname,
      });
  }, [queryDecounce]);

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetchOrders(searchParams);
  }, [params, update]);

  const handleUpdate = async () => {
    const response = await apiUpdateStatus(editOrder._id, {
      status: watch("status"),
    });
    if (response.success) {
      toast.success(response.msg);
      render()
      setEditOrder(null);
    } else toast.error(response.msg);
  };

  const quickViewOrder = (data) => {
    dispatch(
      showModal({
        isShowModal: true,
        modalChildren: (
          <OrderDetail
            data={data}
          />
        ),
      })
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-gray-50 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-50 flex items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h1>
        {editOrder && (
          <div className="flex gap-3 ml-2">
            <ButtonV2 bgColor={`bg-emerald-500`} handleOnClick={handleUpdate}>
              Cập nhật
            </ButtonV2>
            <ButtonV2
              bgColor={`bg-red-600`}
              handleOnClick={() => setEditOrder(null)}>
              Hủy
            </ButtonV2>
          </div>
        )}
      </div>
      <div className="flex justify-end bg-gray-50 items-center px-4">
        <form className="w-[45%]">
          <InputFormV2
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Tìm kiếm"
          />
        </form>
      </div>
      <div className="px-4 w-full">
        <table className="table-auto w-full px-4 text-sm">
          <thead>
            <tr className="border bg-main text-white border-white">
              <th className="text-center py-2">#</th>
              <th className="text-center py-2">Khách hàng</th>
              <th className="text-center py-2">Giá trị đơn hàng</th>
              <th className="text-center py-2">Trạng thái</th>
              <th className="text-center py-2">Ngày mua</th>
              <th className="text-center py-2">Ngày cập nhật</th>
              <th className="text-center py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((el, idx) => (
              <tr className="border border-gray-500" key={el._id}>
                <td className="text-center py-2">
                  {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                    process.env.REACT_APP_LIMIT +
                    idx +
                    1}
                </td>
                <td className="text-center py-2 flex items-center justify-center gap-4">
                  <div className="w-10 h-10">
                    <img
                      src={el.orderBy?.avatar}
                      alt=""
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <p>{el.orderBy?.name}</p>
                </td>
                <td className="text-center py-2">
                  {formatPrice(el.total * 24640)}
                </td>
                <td className="text-center py-2">
                  {editOrder?._id === el._id ? (
                    <select 
                      {...register("status")} 
                      className="form-select"
                      disabled={watch('status') === 3 || 0}
                    >
                      {statusTexts.map((text, index) => (
                        <option key={index} value={index}>
                          {text}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p
                      className={`py-1 text-white border rounded-md ${
                        statusColor[el.status]
                      }`}>
                      {statusTexts[el.status]}
                    </p>
                  )}
                </td>
                <td className="text-center py-2">
                  <p>{formatTime(el.createdAt)}</p>
                </td>
                <td className="text-center py-2">
                  <p>{formatTime(el.updatedAt)}</p>
                </td>
                <td className="text-center py-2">
                  <span
                    onClick={() => {
                      setEditOrder(el);
                      setValue("status", el.status);
                    }}
                    className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                    <BiEdit size={20} />
                  </span>
                  <span
                    onClick={() => quickViewOrder(el)}
                    className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                    <FaEye size={20} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex px-4 justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default withBaseComponent(ManageOrder);
