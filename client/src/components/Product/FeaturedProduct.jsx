import React, { useEffect, useState } from "react";
import { apiGetProduct } from "api/product";
import { ProductCardV2 } from "components";

const FeaturedProduct = () => {
  const [products, setProducts] = useState(null);
  const fetchProduct = async () => {
    const response = await apiGetProduct({
      limit: 9,
      sort: "-totalRating,-rating",
    });
    if (response.success) setProducts(response.productList);
  };
  useEffect(() => {
    fetchProduct();
  }, []);


  return (
    <div className="my-8">
      <h3 className="font-semibold uppercase cursor-pointer text-black text-[20px]">
        Sản phẩm nổi bật
      </h3>
      <div className="grid grid-cols-3 gap-9 my-4 py-6 border-y-4 border-main">
        {products?.map((el, index) => (
          <ProductCardV2 key={index} data={el} pid={el._id}/>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
