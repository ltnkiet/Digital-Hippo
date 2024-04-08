import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

const ProductSlider = ({ products, activeTabs, normal }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
  };
  return (
    <div>
      {products && (
        <Slider {...settings}>
          {products?.map((el, index) => (
            <ProductCard
              key={index}
              pid={el._id}
              data={el}
              isNew={activeTabs === 2 ? true : false}
              normal={normal}
            />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductSlider;
