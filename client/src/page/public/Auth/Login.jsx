import React, { useCallback, useState, useEffect } from "react";
import { InputForm, Button } from "components";
import validate from "utils/helpers";
import { apiLogin, apiRegister, apiForgotPassword, apiEmailVerify } from "api";
import Swal from "sweetalert2";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import path from "utils/path";
import { login } from "store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { LogoV3 } from "asset/img";
import { IoArrowBackOutline } from "asset/icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [registerCode, setRegisterCode] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const resetPayload = () => {
    setPayload({
      name: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  const handleSubmit = useCallback(async () => {
    const { name, phone, ...data } = payload;
    let finalPayload = isRegister
      ? payload
      : { email: payload.email, password: payload.password };
    let invalids = validate(finalPayload, setInvalidFields);
    if (invalids === 0) {
      if (isRegister) {
        const response = await apiRegister(payload);
        if (response.success) {
          setIsVerifiedEmail(true);
        } else Swal.fire("Sự cố!", response.msg, "error");
      } else {
        const res = await apiLogin(data);
        if (res.success) {
          Swal.fire("Hoàn tất", res.msg, "success").then(() => {
            dispatch(
              login({
                isLoggedIn: true,
                token: res.accessToken,
                userData: res.user,
              })
            );
            searchParams.get("redirect")
              ? navigate(searchParams.get("redirect"))
              : navigate(`/${path.HOME}`);
          });
        } else Swal.fire("Sự cố!", res.msg, "error");
      }
    }
  }, [payload]);

  useEffect(() => {
    isLoggedIn && navigate(`/${path.HOME}`);
  }, [isLoggedIn]);

  const handleForgotPass = async () => {
    const response = await apiForgotPassword(payload);
    if (response.success) Swal.fire("Hoàn tất", response.msg, "success");
    else {
      Swal.fire("Sự cố!", response.msg, "error");
    }
  };

  const emailVerify = async () => {
    const response = await apiEmailVerify(registerCode);
    if (response.success) {
      Swal.fire("Hoàn tất", response.msg, "success").then(() => {
        setIsRegister(false);
        resetPayload();
      });
    } else Swal.fire("Sự cố!", response.msg, "error");
    setIsVerifiedEmail(false);
    setRegisterCode(false);
  };

  return (
    <div className="w-full flex items-center justify-center p-5">
      {isVerifiedEmail && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay-70 z-50 flex flex-col justify-center items-center">
          <div className="bg-white w-[90%] max-w-[500px] rounded-md p-8">
            <h4 className="mb-4">
              Nhập mã xác nhận được gửi đến Email vào ô bên dưới
            </h4>
            <input
              type="text"
              value={registerCode}
              onChange={(e) => setRegisterCode(e.target.value)}
              className="p-2 border rounded-md outline-none"
            />
            <button
              type="button"
              className="px-4 py-2 mt-4 mx-auto bg-blue-500 font-semibold text-white rounded-md ml-4"
              onClick={emailVerify}>
              Xác nhận
            </button>
          </div>
        </div>
      )}
      <div className="w-2/5 flex flex-col items-center justify-center p-8 rounded-md shadow-lg border border-main">
        <div className="w-full flex items-start">
          <Link to={`/${path.HOME}`}>
            <IoArrowBackOutline className="text-2xl" />
          </Link>
        </div>
        <img src={LogoV3} className="w-40" alt="" />

        {isForgotPassword ? (
          <>
            <h3 className="font-semibold text-2xl my-5 text-main">
              Quên mật khẩu
            </h3>
            <div className="w-full flex flex-col gap-5">
              <InputForm
                setInvalidFields={setInvalidFields}
                invalidFields={invalidFields}
                label={"EMAIL"}
                value={payload.email}
                setValue={setPayload}
                keyPayload={"email"}
              />
              <Button
                text="Gửi"
                bgColor="bg-main"
                textColor="text-white"
                fullWidth
                onClick={handleForgotPass}
              />
            </div>
            <div className="w-full mt-7 flex justify-start text-xl">
              <small
                onClick={() => setIsForgotPassword(false)}
                className=" hover:underline cursor-pointer">
                Quay lại
              </small>
            </div>
          </>
        ) : (
          <>
            <div className="font-semibold text-2xl my-5 flex items-center justify-center text-main">
              {isRegister
                ? "Chào mừng bạn đến với Digital Hippo"
                : "Chào mừng bạn trở lại với Digital Hippo"}
            </div>
            <div className="w-full flex flex-col gap-5">
              {isRegister && (
                <>
                  <InputForm
                    setInvalidFields={setInvalidFields}
                    invalidFields={invalidFields}
                    label={"HỌ TÊN"}
                    value={payload.name}
                    setValue={setPayload}
                    keyPayload={"name"}
                  />
                  <InputForm
                    setInvalidFields={setInvalidFields}
                    invalidFields={invalidFields}
                    label={"SỐ ĐIỆN THOẠI"}
                    value={payload.phone}
                    setValue={setPayload}
                    keyPayload={"phone"}
                  />
                </>
              )}
              <InputForm
                setInvalidFields={setInvalidFields}
                invalidFields={invalidFields}
                label={"EMAIL"}
                value={payload.email}
                setValue={setPayload}
                keyPayload={"email"}
              />

              <InputForm
                setInvalidFields={setInvalidFields}
                invalidFields={invalidFields}
                label={"MẬT KHẨU"}
                value={payload.password}
                setValue={setPayload}
                keyPayload={"password"}
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-sm hover:text-main cursor-pointer flex justify-end">
                {showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              </button>
              <Button
                text={isRegister ? "Đăng kí" : "Đăng nhập"}
                bgColor="bg-main"
                textColor="text-white"
                fullWidth
                onClick={handleSubmit}
              />
            </div>
            <div className="w-full mt-7 text-xl">
              {isRegister ? (
                <small>
                  <span>Bạn đã có tài khoản?</span>{" "}
                  <span
                    onClick={() => {
                      setIsRegister(false);
                      setPayload({
                        email: "",
                        phone: "",
                        password: "",
                        name: "",
                      });
                    }}
                    className=" hover:text-main cursor-pointer">
                    Đăng nhập ngay
                  </span>
                </small>
              ) : (
                <div className="flex justify-between">
                  <small
                    onClick={() => setIsForgotPassword(true)}
                    className=" hover:text-main cursor-pointer">
                    Bạn quên mật khẩu?
                  </small>
                  <small
                    onClick={() => {
                      setIsRegister(true);
                      setPayload({
                        email: "",
                        phone: "",
                        password: "",
                        name: "",
                      });
                    }}
                    className=" hover:text-main cursor-pointer">
                    Tạo tài khoản mới
                  </small>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
