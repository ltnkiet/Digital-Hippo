import React from "react";
import { Sidebar, Banner, BestSeller, FeaturedProduct } from "components";
import { IoIosArrowForward } from "asset/icons";
import withBaseComponent from "hocs/withBaseComponent";
import { useSelector } from "react-redux";
import { createSearchParams } from "react-router-dom";

const Home = ({ navigate }) => {
  
  const { newProducts } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.app);

  return (
    <div className="w-full px-4">
      <div className="md:w-main m-auto flex flex-col">
        <div className="flex flex-row py-5">
          <div className="flex flex-col gap-5 w-[30%] flex-auto">
            <Sidebar />
          </div>
          <div className="flex flex-col gap-5 pl-5 w-[70%] flex-auto">
            <Banner />
          </div>
        </div>
        <div className="w-main pt-5">
          <BestSeller />
          <FeaturedProduct />
        </div>
        <div className="w-main m-auto">
          <div className="grid-cols-4 hidden lg:grid grid-rows-2 gap-4 my-5">
            <img
              src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661"
              alt=""
              className="w-full h-full object-cover col-span-2 row-span-2"
            />
            <img
              src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner2-bottom-home2_400x.jpg?v=1613166661"
              alt=""
              className="w-full h-full object-cover col-span-1 row-span-1"
            />
            <img
              src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661"
              alt=""
              className="w-full h-full object-cover col-span-1 row-span-2"
            />
            <img
              src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner3-bottom-home2_400x.jpg?v=1613166661"
              alt=""
              className="w-full h-full object-cover col-span-1 row-span-1"
            />
          </div>
        </div>
        <div className="w-main m-auto">
          <h3 className="font-semibold uppercase cursor-pointer text-black text-[20px]">
            Danh mục nổi bật
          </h3>
          <div className="w-screen lg:hidden py-6 pr-4 border-y-4 border-main">
            {categories
              ?.filter((el) => el.brand.length > 0)
              ?.map((el) => (
                <div key={el._id} className="col-span-1">
                  <div className="border w-full flex p-4 gap-4 min-h-[190px]">
                    <div className="w-1/2 flex-1">
                      <img
                        src={el?.image}
                        alt=""
                        className="w-full h-full object-cover p-5"
                      />
                    </div>
                    <div className="w-1/2 flex-1 text-gray-700">
                      <h4 className="font-semibold uppercase">{el.name}</h4>
                      <ul className="text-sm">
                        {el?.brand?.map((item) => (
                          <span
                            key={item}
                            className="flex cursor-pointer hover:underline gap-1 items-center text-gray-500"
                            onClick={() =>
                              navigate({
                                pathname: `/${el.name}`,
                                search: createSearchParams({
                                  brand: item,
                                }).toString(),
                              })
                            }>
                            <IoIosArrowForward size={14} />
                            <li>{item}</li>
                          </span>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="lg:grid hidden py-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-4 border-y-4 border-main">
            {categories
              ?.filter((el) => el.brand.length > 0)
              ?.map((el) => (
                <div key={el._id} className="col-span-1">
                  <div className="border w-full flex p-4 gap-4 min-h-[190px]">
                    <div className="w-1/2 flex-1">
                      <img
                        src={el?.thumb}
                        alt=""
                        className="w-full h-full object-cover p-5"
                      />
                    </div>
                    <div className="w-1/2 flex-1 text-gray-700">
                      <h4 className="font-semibold uppercase">{el.name}</h4>
                      <ul className="text-sm">
                        {el?.brand?.map((item) => (
                          <span
                            key={item}
                            className="flex cursor-pointer hover:underline gap-1 items-center text-gray-500"
                            onClick={() =>
                              navigate({
                                pathname: `/${el.name}`,
                                search: createSearchParams({
                                  brand: item,
                                }).toString(),
                              })
                            }>
                            <IoIosArrowForward size={14} />
                            <li>{item}</li>
                          </span>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="w-full h-20"></div>
    </div>
  );
};

export default withBaseComponent(Home);
