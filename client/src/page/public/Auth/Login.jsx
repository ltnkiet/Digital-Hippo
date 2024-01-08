import React, { useCallback, useState } from "react";
import { InputForm, Button } from "../../../components";
import validate from "../../../utils/validateFields";
import {apiLogin, apiRegister} from '../../../api';
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import path from "../../../utils/path";
import {register} from '../../../store/user/userSlice'
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  console.log(location)
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
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
    })
  }
  const handleSubmit = useCallback( async () => {
    const {name, phone, ...data} = payload;
    if(isRegister) {
      const response = await apiRegister(payload) 
      if(response.data.success) {
        Swal.fire("Hoàn tất", response?.data?.msg, "success")
        // .then(() => {
        //   setIsRegister(false)
        //   resetPayload()
        // })
      } else Swal.fire("Sự cố!", response?.data?.msg, "error");
    } else {
      const res = await apiLogin(data)
      if(res.data.success) {
        Swal.fire("Hoàn tất", res?.data?.msg, "success").then(() => {
          dispatch(register({isLoggedIn: true, token: res.data.accessToken, userData: res.data.user}))
          navigate(`/${path.HOME}`)
        })
      } else Swal.fire("Sự cố!", res?.data?.msg, "error");
    }
  }, [payload]);

  const handleForgotPass = async () => {
    // const response = await apiForgotPassword(payload);
    // if (response?.data?.err === 1)
    //   Swal.fire("Sự cố!", response?.data?.msg, "error");
    // else {
    //   Swal.fire("Hoàn tất", response?.data?.msg, "success");
    // }
  };
  return (
    <div className="w-full flex items-center justify-center p-5">
      <div className="bg-sky-400 w-2/5 p-8 rounded-md shadow-lg">
        {isForgotPassword ? (
          <>
            <h3 className="font-semibold text-2xl mb-5">Quên mật khẩu</h3>
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
                bgColor="bg-white"
                textColor="text-black"
                fullWidth
                onClick={handleForgotPass}
              />
            </div>
            <div className="mt-7 flex items-center justify-between text-xl">
              <small
                onClick={() => setIsForgotPassword(false)}
                className="text-white hover:underline cursor-pointer">
                Quay lại
              </small>
            </div>
          </>
        ) : (
          <>
            <div className="font-semibold text-3xl mb-5 flex items-center justify-center">
              {isRegister ? "Đăng kí tài khoản" : "Đăng nhập"}
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
                className="text-white text-sm hover:underline cursor-pointer flex justify-end">
                {showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              </button>
              <Button
                text={isRegister ? "Đăng kí" : "Đăng nhập"}
                bgColor="bg-white"
                textColor="text-black"
                fullWidth
                onClick={handleSubmit}
              />
            </div>
            <div className="mt-7 flex items-center justify-between text-xl">
              {isRegister ? (
                <small>
                  Bạn đã có tài khoản?{" "}
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
                    className="text-white hover:underline cursor-pointer">
                    Đăng nhập ngay
                  </span>
                </small>
              ) : (
                <>
                  <small
                    onClick={() => setIsForgotPassword(true)}
                    className="text-white hover:underline cursor-pointer">
                    Bạn quên mật khẩu
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
                    className="text-white hover:hover:underline cursor-pointer">
                    Tạo tài khoản mới
                  </small>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
