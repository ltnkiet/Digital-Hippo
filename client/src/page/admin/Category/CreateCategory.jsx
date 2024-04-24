import React, { useCallback, useState, useEffect } from "react";
import { InputFormV2, ButtonV2, Loading } from "components";
import { useForm } from "react-hook-form";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { apiCreateCategory } from "api";
import { showModal } from "store/app/appSlice";
import withBaseComponent from "hocs/withBaseComponent";
import { useSearchParams } from "react-router-dom";
import path from 'utils/path'
const CreateCategory = ({ dispatch, navigate }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();

  const [searchParams] = useSearchParams();
  const [preview, setPreview] = useState({ thumb: null });
  const [invalidFields, setInvalidFields] = useState([]);
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  useEffect(() => {
    handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  const handleCreateCategory = async (data) => {
    const invalids = validate(data, setInvalidFields);
    if (invalids === 0) {
      const formData = new FormData();
      for (let i of Object.entries(data)) formData.append(i[0], i[1]);
      if (data.thumb) formData.append("thumb", data.thumb[0]);

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiCreateCategory(formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      if (response.success) {
        toast.success(response.msg);
        navigate(`/${path.ADMIN}/${path.MANAGE_CATEGORY}`)
        
      } else toast.error(response.msg);
    }
  };

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span>Tạo sản phẩm</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateCategory)}>
          <InputFormV2
            label="Tên danh mục"
            register={register}
            errors={errors}
            id="name"
            validate={{
              required: "Need fill this field",
            }}
            fullWidth
            placeholder="Nhập tên sản phẩm"
          />
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
          <div className="my-6">
            <ButtonV2 type="submit">Xác nhận</ButtonV2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withBaseComponent(CreateCategory);
