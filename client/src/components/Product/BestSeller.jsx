import React, { useState, useEffect } from "react";
import { apiGetProduct } from "api/product";
import { getNewProduct } from "store/product/asyncActions";
import { ProductSlider } from "components";
import { useDispatch, useSelector } from "react-redux";

const tabs = [
  { id: 1, tabname: "bán chạy nhất" },
  { id: 2, tabname: "sản phẩm mới" },
];

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState(null);
  // eslint-disable-next-line
  const [activeTabs, setActiveTabs] = useState(1);
  const [productTab, setProductTab] = useState(null);
  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.product);
  const fetchProduct = async () => {
    const response = await apiGetProduct({ sort: "-sold", limit: 10 });
    if (response.success) {
      setBestSeller(response.productList);
      setProductTab(response.productList);
    }
  };
  useEffect(() => {
    dispatch(getNewProduct());
    fetchProduct();
  }, []);
  useEffect(() => {
    if (activeTabs === 1) setProductTab(bestSeller);
    if (activeTabs === 2) setProductTab(newProducts);
  }, [bestSeller, newProducts]);

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
        <ProductSlider products={productTab} activeTabs={activeTabs} />
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
