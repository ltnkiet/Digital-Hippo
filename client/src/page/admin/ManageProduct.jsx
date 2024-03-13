import React, { useCallback, useEffect, useState } from "react";
import { CustomizeVarriant, InputFormV2, Pagination } from "components";
import { useForm } from "react-hook-form";
import { apiGetProduct, apiDeleteProduct } from "api";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import UpdateProduct from "./UpdateProduct";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BiEdit, BiCustomize, RiDeleteBin6Line } from "asset/icons";
import { formatPrice, formatTimeV2 } from "utils/helpers";

const ManageProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const {
    register,
    formState: { errors },
    watch,
  } = useForm();
  const [products, setProducts] = useState(null);
  const [counts, setCounts] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [customizeVarriant, setCustomizeVarriant] = useState(null);

  const render = useCallback(() => {
    setUpdate(!update);
  });

  const fetchProducts = async (params) => {
    const response = await apiGetProduct({
      ...params,
      limit: process.env.REACT_APP_LIMIT,
    });
    if (response.success) {
      setCounts(response.counts);
      setProducts(response.productList);
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
    fetchProducts(searchParams);
  }, [params, update]);

  const handleDeleteProduct = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure remove this product",
      icon: "warning",
      showCancelButton: true,
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        const response = await apiDeleteProduct(pid);
        if (response.success) toast.success(response.mes);
        else toast.error(response.mes);
        render(); 
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {editProduct && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <UpdateProduct
            editProduct={editProduct}
            render={render}
            setEditProduct={setEditProduct}
          />
        </div>
      )}
      {customizeVarriant && (
        <div className="absolute inset-0 min-h-screen bg-gray-100 z-50">
          <CustomizeVarriant
            customizeVarriant={customizeVarriant}
            render={render}
            setCustomizeVarriant={setCustomizeVarriant}
          />
        </div>
      )}
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
      </div>
      <div className="flex justify-end items-center px-4">
        <form className="w-[45%]">
          <InputFormV2
            id="q"
            register={register}
            errors={errors}
            fullWidth
            placeholder="Search products by title, description,..."
          />
        </form>
      </div>
      <table className="table-auto">
        <thead>
          <tr className="border bg-sky-900 text-white border-white">
            {/* <th className="text-center py-2">Order</th> */}
            {/* <th className="text-center py-2">Ảnh bìa</th> */}
            <th className="text-center py-2">Tên</th>
            <th className="text-center py-2">Danh mục</th>
            <th className="text-center py-2">Thương hiệu</th>
            <th className="text-center py-2">Đơn giá</th>
            <th className="text-center py-2">SL</th>
            <th className="text-center py-2">Lượt bán</th>
            <th className="text-center py-2">Màu</th>
            <th className="text-center py-2">Lượt đánh giá</th>
            <th className="text-center py-2">Biến thể</th>
            <th className="text-center py-2">Cập nhật</th>
            <th className="text-center py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((el, idx) => (
            <tr className="border-b" key={el._id}>
              {/* <td className="text-center py-2">
                {(+params.get("page") > 1 ? +params.get("page") - 1 : 0) *
                  process.env.REACT_APP_LIMIT +
                  idx +
                  1}
              </td> */}
              {/* <td className="text-center py-2">
                <img
                  src={el.thumb}
                  alt="thumb"
                  className="w-12 h-12 object-cover"
                />
              </td> */}
              <td className="text-center py-2">{el.title}</td>
              <td className="text-center py-2">{el.category.name}</td>
              <td className="text-center py-2">{el.brand}</td>
              <td className="text-center py-2">{formatPrice(el.price)}</td>
              <td className="text-center py-2">{el.quantity}</td>
              <td className="text-center py-2">{el.sold}</td>
              <td className="text-center py-2">{el.color}</td>
              <td className="text-center py-2">{el.totalRating}</td>
              <td className="text-center py-2">{el?.varriants?.length || 0}</td>
              <td className="text-center py-2">{formatTimeV2(el.updatedAt)}</td>
              <td className="text-center py-2">
                <span
                  onClick={() => setEditProduct(el)}
                  className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                  <BiEdit size={20} />
                </span>
                <span
                  onClick={() => handleDeleteProduct(el._id)}
                  className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                  <RiDeleteBin6Line size={20} />
                </span>
                <span
                  onClick={() => setCustomizeVarriant(el)}
                  className="text-blue-500 hover:text-orange-500 inline-block hover:underline cursor-pointer px-1">
                  <BiCustomize size={20} />
                </span>
              </td>
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

export default ManageProduct;
