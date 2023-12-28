import React, { useState, useEffect } from "react";
import { InputForm, Button } from "../../../components";
import background from '../../../asset/img/thumbnail.jpg';
import {Link} from 'react-router-dom'
import {IoArrowBackOutline} from "../../../asset/icons";
import {btnClick} from "../../../asset/animation";
import { motion } from "framer-motion";
import path from "../../../utils/path";
const Login = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [payload, setPayload] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
  });
  const validate = (payload) => {
    let invalids = 0;
    let fields = Object.entries(payload);
    fields.forEach((item) => {
      if (item[1] === "") {
        setInvalidFields((prev) => [
          ...prev,
          {
            name: item[0],
            message: "Bạn không được bỏ trống trường này.",
          },
        ]);
        invalids++;
      }
    });
    fields.forEach((item) => {
      switch (item[0]) {
        case "password":
          if (item[1].length < 8) {
            setInvalidFields((prev) => [
              ...prev,
              {
                name: item[0],
                message: "Mật khẩu phải có tối thiểu 8 kí tự.",
              },
            ]);
            invalids++;
          }
          break;
        case "phone":
          const phoneRegex = /^\d{10,11}$/;
          if (!phoneRegex.test(item[1])) {
            setInvalidFields((prev) => [
              ...prev,
              {
                name: item[0],
                message: "Số điện thoại không hợp lệ.",
              },
            ]);
            invalids++;
          }
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(item[1])) {
            setInvalidFields((prev) => [
              ...prev,
              {
                name: item[0],
                message: "Email không hợp lệ.",
              },
            ]);
            invalids++;
          }
          break;
        default:
          break;
      }
    });
    return invalids;
  };
  return (
    <div className="w-screen h-screen relative">
      <img src={background} alt="" className="w-[70%] h-full object-cover right-0 absolute"/>
      <div className="bg-white w-[30%] h-full p-[30px] pb-[50px]">
        <Link to={path.PUBLIC}>
          <motion.div {...btnClick} className={"font-semibold text-xl mb-3 flex items-center gap-3 cursor-pointer py-5"}> 
            <IoArrowBackOutline className="text-2xl"/>
            Trở về
          </motion.div> 
        </Link>
        <h3 className="font-semibold text-2xl mb-3">
          {isRegister ? "Đăng kí tài khoản" : "Đăng nhập"}
        </h3>
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
                label={"EMAIL"}
                value={payload.email}
                setValue={setPayload}
                keyPayload={"email"}
              />
            </>
          )}
          <InputForm
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            label={"SỐ ĐIỆN THOẠI"}
            value={payload.phone}
            setValue={setPayload}
            keyPayload={"phone"}
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
            className="text-blue-500 text-sm hover:underline cursor-pointer flex justify-end">
            {showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
          </button>
          <Button
            text={isRegister ? "Đăng kí" : "Đăng nhập"}
            bgColor="bg-main"
            textColor="text-white"
            fullWidth
            // onClick={handleSubmit}
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
                className="text-blue-500 hover:underline cursor-pointer">
                Đăng nhập ngay
              </span>
            </small>
          ) : (
            <>
              <small className="text-blue-500 hover:underline cursor-pointer">
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
                className="text-blue-500 hover:hover:underline cursor-pointer">
                Tạo tài khoản mới
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
