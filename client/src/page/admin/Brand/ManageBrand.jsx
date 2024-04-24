import React, { useCallback, useEffect, useState } from "react";
import { InputFormV2, Pagination, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSearchParams, createSearchParams } from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import UpdateBrand from "./UpdateBrand";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BiEdit, RiDeleteBin6Line } from "asset/icons";
import { formatTimeV2 } from "utils/helpers";
import { apiGetBrand, apiDeleteBrand } from "api";
import withBaseComponent from "hocs/withBaseComponent";

const ManageBrand = ({ navigate, location }) => {
  const [params] = useSearchParams();
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();

  const [brand, setBrand] = useState(null);
  const [counts, setCounts] = useState(0);
  const [editBrand, setEditBrand] = useState(null);
  const [update, setUpdate] = useState(false);
  // eslint-disable-next-line
  const render = useCallback(() => {
    setUpdate(!update);
  });

  const fetchBrand = async (params) => {
    const response = await apiGetBrand({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.counts);
      setBrand(response.brands);
    }
  };
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
    fetchBrand(searchParams);
  }, [params, update]);

  const handleDeleteBrand = (id) => {
    Swal.fire({
      icon: "question",
      title: "Xóa thương hiệu",
      text: "Bạn có chắc là muốn xóa thương hiệu này?",
      cancelButtonText: "Hủy",
      confirmButtonText: "Xóa",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteBrand(id);
        if (response.success) toast.success(response.msg);
        else toast.error(response.msg);
        render();
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {editBrand && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <UpdateBrand
            editBrand={editBrand}
            render={render}
            setEditBrand={setEditBrand}
          />
        </div>
      )}
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý thương hiệu
        </h1>
      </div>
      <div className="flex justify-end items-center px-4">
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
        <table className="table-auto w-full px-4">
          <thead>
            <tr className="border bg-main text-white border-white">
              <th className="text-center py-2 px-1">#</th>
              <th className="text-center py-2">Thương hiệu</th>
              <th className="text-center py-2">Logo</th>
              <th className="text-center py-2">Số sản phẩm</th>
              <th className="text-center py-2">Ngày tạo</th>
              <th className="text-center py-2">Cập nhật</th>
              <th className="text-center py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {brand === null ? (
              <tr>
                <td colSpan="12" className="py-4">
                  <div className="flex items-center justify-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            ) : (
              brand?.map((el, idx) => (
                <tr className="border border-gray-500" key={el._id}>
                  <td className="text-center py-2">
                    {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                      process.env.REACT_APP_LIMIT +
                      idx +
                      1}
                  </td>
                  <td className="text-center py-2">{el.name}</td>
                  <td className="flex items-center justify-center py-2">
                    <div className="w-10 flex items-center justify-center">
                      <img
                        src={el.thumb}
                        alt=""
                        className="w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="text-center py-2">{el.totalProducts}</td>
                  <td className="text-center py-2">
                    {formatTimeV2(el.updatedAt)}
                  </td>
                  <td className="text-center py-2">
                    {formatTimeV2(el.updatedAt)}
                  </td>
                  <td className="text-center py-2">
                    <span
                      onClick={() => setEditBrand(el)}
                      className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                      <BiEdit size={20} />
                    </span>
                    <span
                      onClick={() => handleDeleteBrand(el._id)}
                      className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                      <RiDeleteBin6Line size={20} />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end my-8 px-4">
        <Pagination totalCount={counts} />
      </div>
    </div>
  );
};

export default withBaseComponent(ManageBrand);
