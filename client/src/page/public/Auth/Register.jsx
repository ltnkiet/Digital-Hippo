import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import path from "../../../utils/path";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  useEffect(() => {
    if (status === "that-bai") {
      Swal.fire("Sự cố!", "Đăng ký không thành công", "error").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
    if (status === "thanh-cong") {
      Swal.fire("Hoàn tất", "Đăng ký thành công. Vui lòng tiến đến đăng nhập", "success").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    }
  }, []);
  return (
    <div className="w-screen h-screen"></div>
  );
};

export default Register;
