import React, { useState } from "react";
import { InputForm, Button } from "../../../components";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { apiResetPassword } from "../../../api";
import validate from "../../../utils/helpers";

const ResetPassword = () => {
  const [payload, setPayload] = useState({ password: "", confirmPass: "" });
  const [invalidFields, setInvalidFields] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();

  const handleReset = async () => {
    let invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      const response = await apiResetPassword({ ...payload, token });
      if (response.success)
        Swal.fire("Hoàn tất", response.msg, "success");
      else {
        Swal.fire("Sự cố!", response.msg, "error");
      }
    }
  };
  return (
    <div className="w-full flex items-center justify-center p-10">
      <div className="bg-main w-2/5 p-8 rounded-md shadow-sm">
        <h3 className="font-semibold text-2xl mb-6">Cập nhật mật khẩu</h3>
        <div className="w-full flex flex-col gap-5">
          <InputForm
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            label={"MẬT KHẨU MỚI"}
            value={payload.password}
            setValue={setPayload}
            keyPayload={"password"}
            type={showPassword ? "text" : "password"}
          />
          <InputForm
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            label={"NHẬP LẠI MẬT KHẨU"}
            value={payload.confirmPass}
            setValue={setPayload}
            keyPayload={"confirmPass"}
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-white text-sm hover:underline cursor-pointer flex justify-end">
            {showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
          </button>
          <Button
            text={"Xác nhận"}
            bgColor="bg-white"
            textColor="text-black"
            fullWidth
            onClick={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
