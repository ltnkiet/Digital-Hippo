import { InputFormV2, ButtonV2, Loading } from "components";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { apiUpdateCategory } from "api";
import { showModal } from "store/app/appSlice";
import withBaseComponent from "hocs/withBaseComponent";

const UpdateCategory = ({
  editCategory,
  render,
  setEditCategory,
  dispatch,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [preview, setPreview] = useState({ thumb: null });
  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    reset({
      name: editCategory?.name || "",
    });
    setPreview({
      thumb: editCategory?.thumb || "",
    });
  }, [editCategory]);

  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  const handleUpdateCategory = async (data) => {
    const invalids = validate(data, setInvalidFields);
    if (invalids === 0) {
      const payload = { ...data };
      payload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];

      const formData = new FormData();
      for (let i of Object.entries(payload)) formData.append(i[0], i[1]);

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateCategory(editCategory._id, formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      
      if (response.success) {
        toast.success(response.msg);
        render();
        setEditCategory(null);
      } else toast.error(response.msg);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Chỉnh sửa danh mục
        </h1>
        <span
          className="bg-red-500 rounded-md p-2 font-medium text-white hover:underline cursor-pointer"
          onClick={() => setEditCategory(null)}>
          Hủy
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateCategory)}>
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
            <input type="file" id="thumb" {...register("thumb")} />
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
            <ButtonV2 bgColor={"bg-green-400"} type="submit">
              Cập nhật
            </ButtonV2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withBaseComponent(UpdateCategory);
