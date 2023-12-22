import React, { useState, useEffect } from "react";
import { apiGetProduct } from "../../api/product";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

const tabs = [
  { id: 1, tabname: "bán chạy nhất" },
  { id: 2, tabname: "sản phẩm mới" },
];

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 3,
};

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState(null);
  // eslint-disable-next-line
  const [newProduct, setNewProduct] = useState(null);
  const [activeTabs, setActiveTabs] = useState(1);
  const [productTab, setProductTab] = useState(null);

  const fetchProduct = async () => {
    const response = await Promise.all([
      apiGetProduct({ sort: "-sold" }),
      apiGetProduct({ sort: "-createdAt" }),
    ]);
    if (response[0]?.data.success) {
      setBestSeller(response[0]?.data.productList);
      setProductTab(response[0]?.data.productList);
    }
    if (response[1]?.data.success) setNewProduct(response[1]?.data.productList);
    setProductTab(response[0]?.data.productList);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (activeTabs === 1) setProductTab(bestSeller);
    if (activeTabs === 2) setProductTab(newProduct);
  }, [activeTabs]);

  return (
    <div>
      <div className="flex text-[20px] gap-8">
        {tabs.map((el) => (
          <p
            key={el.id}
            onClick={() => setActiveTabs(el.id)}
            className={`font-semibold uppercase cursor-pointer ${
              activeTabs === el.id ? "text-black" : `text-gray-400`
            }`}>
            {el.tabname}
          </p>
        ))}
      </div>
      <div className="my-4 px-4 py-6 border-y-4 border-main">
        <Slider {...settings}>
          {productTab?.map((el) => (
            <ProductCard
              key={el.id}
              pid={el.id}
              data={el}
              isNew={activeTabs === 1 ? false : true}
            />
          ))}
        </Slider>
      </div>
      <div className="w-full flex gap-4 mt-8">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt=""
          className="flex-1 object-contain"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt=""
          className="flex-1 object-contain"
        />
      </div>
    </div>
  );
};

export default BestSeller;
