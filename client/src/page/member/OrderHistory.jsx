import { apiGetUserOrders } from "api";
import { CustomSelect, InputFormV2, Pagination } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useSearchParams } from "react-router-dom";
import {
  statusClasses,
  statusColor,
  statusOrdersUser,
  statusTexts,
} from "utils/contant";
import { formatTime, formatPrice } from "utils/helpers";

const OrderHistory = ({ navigate, location }) => {
  const [orders, setOrders] = useState(null);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const q = watch("q");
  const status = watch("status");
  const fetchPOrders = async (params) => {
    const response = await apiGetUserOrders({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setOrders(response.orderList);
      setCounts(response.counts);
    }
  };
  useEffect(() => {
    const pr = Object.fromEntries([...params]);
    fetchPOrders(pr);
  }, [params]);

  const handleSearchStatus = ({ value }) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({ status: value }).toString(),
    });
  };

  return (
    <div className="w-full relative px-4">
      <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
        Lịch sử mua
      </header>
      <div className="flex justify-end items-center px-4">
        <form className="w-[45%] grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <InputFormV2
              id="q"
              register={register}
              errors={errors}
              fullWidth
              placeholder="Tìm kiếm"
            />
          </div>
          <div className="col-span-1 flex items-center">
            <CustomSelect
              options={statusOrdersUser}
              value={status}
              onChange={(val) => handleSearchStatus(val)}
              wrapClassname="w-full"
            />
          </div>
        </form>
      </div>
      <table className="table-auto w-full">
        <thead>
          <tr className="border bg-main text-white border-white">
            <th className="text-center py-2">#</th>
            <th className="text-center py-2">Sản phẩm</th>
            <th className="text-center py-2">Tổng tiền</th>
            <th className="text-center py-2">Trạng thái</th>
            <th className="text-center py-2">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((el, idx) => (
            <tr className="border-b" key={el._id}>
              <td className="text-center py-2">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  idx +
                  1}
              </td>
              <td className="text-center py-2">
                <div className="flex items-center justify-center gap-2">
                  {el.products?.map((item) => (
                    <div key={item._id} className="w-15 h-16">
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-full h-full object-contain rounded-md bg-none"
                      />
                    </div>
                  ))}
                </div>
              </td>
              <td className="text-center py-2">
                <p className="text-yellow-300 font-semibold ">
                  {formatPrice(el.total * 24640)}
                </p>
              </td>
              <td className="text-center py-2">
                <p
                  className={`py-1 text-white border rounded-md ${
                    statusColor[el.status]
                  }`}>
                  {statusTexts[el.status]}
                </p>
              </td>
              <td className="text-center py-2">{formatTime(el.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end my-8">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default withBaseComponent(OrderHistory);
