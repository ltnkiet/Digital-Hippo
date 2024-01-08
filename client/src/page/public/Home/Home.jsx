import React from "react";
import { Sidebar, Banner, BestSeller, FeaturedProduct } from "../../../components";
import { useSelector } from "react-redux";
const Home = () => {
  const { newProducts } = useSelector((state) => state.product)
  const { categories } = useSelector((state) => state.app)

  return (
    <>
      <div className="w-main flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-col gap-5 w-[30%] flex-auto">
            <Sidebar />
          </div>
          <div className="flex flex-col gap-5 pl-5 w-[70%] flex-auto">
            <Banner />
          </div>
        </div>
        <div className="w-main py-5">
          <BestSeller />
          <FeaturedProduct/>
        </div>
      </div>
      <div className="w-full h-[500px]"></div>
      
    </>
  );
};

export default Home;
