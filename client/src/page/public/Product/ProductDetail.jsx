import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProductDetail } from "../../../api/product";
import { Breadcrumbs } from "../../../components";
import Slider from "react-slick";

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

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
  };

  return (
    <div className="w-full">
      <div className="h-[80px] flex items-center justify-center bg-gray-200">
        <div className="w-main">
          <h1 className="text-xl font-medium">{title}</h1>
          <Breadcrumbs title={title} category={product?.category?.name}/>
        </div>
      </div>
      <div className="w-main m-auto mt-4 flex">
        <div className="flex flex-col gap-4 w-2/5">
          <div className="w-[458px] h-[458px] border">
            <img src={product?.images} alt="" className="w-full h-full object-contain p-2" />
          </div>
          <div className="w-[458px]">
            <Slider {...settings}>
              {product?.images?.map(el => (
                <div className="w-[143px] h-[143px] px-2" key={el}>
                  <img src={el} alt="" className="w-full h-full object-contain border p-1"/>  
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="w-2/5">price</div>
        <div className="w-1/5">Infor</div>
      </div>
    </div>
  );
};

export default ProductDetail;
