import React, { useCallback, useState, useEffect } from "react";
import { InputFormV2, Select, ButtonV2, MDEditor, Loading } from "components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { apiCreateProduct } from "api";
import { showModal } from "store/app/appSlice";
import withBaseComponent from "hocs/withBaseComponent";
import path from "utils/path";

const CreateProduct = ({ navigate }) => {
  const { categories, brands } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const [payload, setPayload] = useState({
    description: [],
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });
  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback((e) => setPayload(e), [payload]);

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({ name: file.name, path: base64 });
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };
  useEffect(() => {
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);
  useEffect(() => {
    handlePreviewImages(watch("images"));
  }, [watch("images")]);

  const handleCreateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category)
        data.category = categories?.find((el) => el._id === data.category)?._id;
      if (data.brand)
        data.brand = brands?.find((el) => el._id === data.brand)?._id;
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
      if (finalPayload.images) {
        for (let image of finalPayload.images) formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateProduct(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      if (response.success) {
        toast.success(response.msg);
        navigate(`/${path.ADMIN}/${path.MANAGE_PRODUCTS}`)
      } else toast.error(response.msg);
    }
  };
  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Tạo sản phẩm</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputFormV2
            label="Tên sản phẩm"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Vui lòng nhập thông tin",
            }}
            fullWidth
            placeholder="Nhập tên sản phẩm"
          />
          <div className="w-full my-6 flex gap-4">
            <InputFormV2
              label="Giá"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Vui lòng nhập thông tin",
                min: { value: 0, message: "Số lượng không được âm" },
              }}
              style="flex-auto"
              placeholder="Nhập giá sản phẩm"
              type="number"
            />
            <InputFormV2
              label="Số lượng"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Vui lòng nhập thông tin",
                min: { value: 0, message: "Số lượng không được âm" },
              }}
              style="flex-auto"
              placeholder="Nhập số lượng sản phẩm"
              type="number"
            />
            <InputFormV2
              label="Màu"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Vui lòng nhập thông tin",
              }}
              style="flex-auto"
              placeholder="Nhập màu sản phẩm"
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Danh mục"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.name,
              }))}
              register={register}
              id="category"
              validate={{ required: "Vui lòng nhập thông tin" }}
              style="flex-auto"
              errors={errors}
              fullWidth
            />
            <Select
              label="Thương hiệu"
              options={brands?.map((el) => ({
                code: el._id,
                value: el.name,
              }))}
              register={register}
              id="brand"
              validate={{ required: "Vui lòng nhập thông tin" }}
              style="flex-auto"
              errors={errors}
              fullWidth
            />
          </div>
          <div className="w-full my-6">
            <MDEditor
              label="Mô tả"
              name="description"
              changeValue={changeValue}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
            />
          </div>
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">
              Ảnh bìa
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb", { required: "Need fill" })}
            />
            {errors["thumb"] && (
              <small className="text-xs text-red-500">
                {errors["thumb"]?.message}
              </small>
            )}
          </div>
          {preview.thumb && (
            <div className="my-4">
              <img
                src={preview.thumb}
                alt="thumbnail"
                className="w-[200px] object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="products">
              Ảnh chi tiết sản phẩm
            </label>
            <input
              type="file"
              id="products"
              multiple
              {...register("images", { required: "Need fill" })}
            />
            {errors["images"] && (
              <small className="text-xs text-red-500">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preview.images.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {preview.images?.map((el, idx) => (
                <div key={idx} className="w-fit relative">
                  <img
                    src={el.path}
                    alt="product"
                    className="w-[200px] object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="my-6">
            <ButtonV2 type="submit">Xác nhận</ButtonV2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withBaseComponent(CreateProduct);
