import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProductDetail } from "../../../api/product";
import { Breadcrumbs } from "../../../components";

const ProductDetail = () => {

  const { pid, title} = useParams();
  const [product, setProduct] = useState(null)

  const fetchProductDetail = async () => {
    const response = await apiGetProductDetail(pid);
    if(response.success) setProduct(response.productDetail)
  };

  useEffect(() => {
    if (pid) fetchProductDetail();
  }, [pid]);
  return (
    <div className="w-full">
      <div className="h-[80px] flex items-center justify-center bg-gray-200">
        <div className="w-main">
          <h1 className="text-xl font-medium">{title}</h1>
          <Breadcrumbs title={title} category={product?.category?.name}/>
        </div>
      </div>
      <div className="w-main m-auto">
        Detail
      </div>
    </div>
  );
};

export default ProductDetail;
