import React, { useState, useEffect } from "react";
import { apiGetProduct } from "../api/product";
import Slider from "react-slick";
import Product from './Product'

const tabs = [
  { id: 1, tabname: "bán chạy nhất" },
  { id: 2, tabname: "sản phẩm mới" },
];

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
};

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState(null);
  const [newProduct, setNewProduct] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);

  const fetchPro = async () => {
    const response = await Promise.all([
      apiGetProduct({ sort: "-sold" }),
      apiGetProduct({ sort: "-createdAt" }),
    ]);
    if (response[0]?.data.success) setBestSeller(response[0]?.data.productList);
    if (response[1]?.data.success) setNewProduct(response[1]?.data.productList);
  };

  useEffect(() => {
    fetchPro();
  }, []);

  return (
    <div>
      <div className="flex text-[20px] gap-8 pb-4 border-b-4 border-main">
        {tabs.map((el) => (
          <span
            key={el.id}
            onClick={() => setActiveTabs(el.id)}
            className={`font-medium capitalize text-textColor cursor-pointer ${
              activeTabs === el.id ? `text-black` : ``
            }`}>
            {el.tabname}
          </span>
        ))}
      </div>
      <div className="mt-4 z-20">
        <Slider {...settings}>
          {bestSeller?.map(el => (
            <Product key={el.id} data={el} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BestSeller;
