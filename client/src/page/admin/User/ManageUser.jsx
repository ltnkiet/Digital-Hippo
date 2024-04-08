import React, { useCallback, useEffect, useState } from "react";
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from "api";
import { blockStatus } from "utils/contant";
import moment from "moment";
import {
  InputField,
  Pagination,
  InputFormV2,
  Select,
  ButtonV2,
} from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import clsx from "clsx";

const ManageUser = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    email: "",
    name: "",
    role: "",
    phone: "",
    isBlocked: "",
  });
  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState({ q: "" });
  const [update, setUpdate] = useState(false);
  const [editElm, setEditElm] = useState(null);
  const [params] = useSearchParams();

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) setUsers(response);
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const queriesDebounce = useDebounce(queries.q, 800);
  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchUsers(queries);
  }, [queriesDebounce, params, update]);

  const handleUpdate = async (data) => {
    const response = await apiUpdateUser(data, editElm._id);
    if (response.success) {
      setEditElm(null);
      render();
      toast.success(response.msg);
    } else toast.error(response.msg);
  };

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Are you sure...",
      text: "Are you ready remove this user?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUser(uid);
        if (response.success) {
          render();
          toast.success(response.mes);
        } else toast.error(response.mes);
      }
    });
  };

  return (
    <div className={clsx("w-full", editElm && "pl-16")}>
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span className="uppercase">Quản lý tài khoản người dùng</span>
      </h1>
      <div className="w-full p-4">
        <div className="flex justify-end py-2">
          <InputField
            nameKey={"q"}
            value={queries.q}
            setValue={setQueries}
            style={"w500"}
            placeholder="Tìm kiếm"
            isHideLabel
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {editElm && <ButtonV2 type="submit">Cập nhật</ButtonV2>}
          <table className="table-auto mb-6 text-left w-full text-sm">
            <thead className="font-bold bg-main text-[13px] text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Tên khách</th>
                <th className="px-4 py-2">Di động</th>
                <th className="px-4 py-2">Số đơn hàng</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày tham gia</th>
                <th className="px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users?.users?.map((el, idx) => (
                <tr key={el._id} className="border border-gray-500">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputFormV2
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editElm?.email}
                        id={"email"}
                        validate={{
                          required: "Require fill.",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        }}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputFormV2
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editElm?.name}
                        id={"name"}
                        validate={{ required: "Require fill." }}
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center gap-3">
                        <img
                          src={el.avatar}
                          className="w-full h-full object-contain rounded-full"
                          alt=""
                        />
                        <span>{el.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <InputFormV2
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editElm?.phone}
                        id={"phone"}
                        validate={{
                          required: "Require fill.",
                          pattern: {
                            value: /^\d{9}$/,
                            message: "Invalid phone number",
                          },
                        }}
                      />
                    ) : (
                      <span>0{el.phone}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">{el.totalOrders}</td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={el.isBlocked}
                        id={"isBlocked"}
                        validate={{ required: "Require fill." }}
                        options={blockStatus}
                      />
                    ) : (
                      <span>{el.isBlocked ? "Khóa" : "Hoạt động"}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-4">
                    {editElm?._id === el._id ? (
                      <span
                        onClick={() => setEditElm(null)}
                        className="px-2 text-orange-600 hover:underline cursor-pointer">
                        Hủy
                      </span>
                    ) : (
                      <span
                        onClick={() => setEditElm(el)}
                        className="px-2 text-orange-600 hover:underline cursor-pointer">
                        Sửa
                      </span>
                    )}
                    <span
                      onClick={() => handleDeleteUser(el._id)}
                      className="px-2 text-orange-600 hover:underline cursor-pointer">
                      Xóa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
        <div className="w-full flex justify-end">
          <Pagination totalCount={users?.counts} />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
