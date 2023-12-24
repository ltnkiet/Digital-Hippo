import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

const ProductSlider = ({products, activeTabs}) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
  };
  return (
    <>
      {products && (
        <Slider {...settings}>
          {products?.map((el) => (
            <ProductCard
              key={el.id}
              pid={el.id}
              data={el}
              isNew={activeTabs === 1 ? false : true}
            />
          ))}
        </Slider>
      )}
    </>
  );
};

export default ProductSlider;
