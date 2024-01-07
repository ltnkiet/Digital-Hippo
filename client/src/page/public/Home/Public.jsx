import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation, Footer } from "../../../components";

const Public = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <Navigation />
      <div className="w-main py-5">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Public;
