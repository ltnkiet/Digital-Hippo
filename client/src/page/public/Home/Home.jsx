import React from "react";
import { Sidebar, Banner, BestSeller, FeaturedProduct } from "components";

const Home = () => {

  // const { newProducts } = useSelector((state) => state.product)
  // const { categories } = useSelector((state) => state.app)
  // const { isLoggedIn, current } = useSelector((state) => state.user);
  // console.log(current)

  return (
    <>
      <div className="w-main flex flex-col">
        <div className="flex flex-row py-5">
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
