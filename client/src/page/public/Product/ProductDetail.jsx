import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
import DOMPurify from "dompurify";
import { useSelector } from "react-redux"


import { Breadcrumbs, SelectQuantity, ButtonV2, ProductReview, ProductSlider } from "../../../components";

import { formatPrice, renderStar } from "../../../utils/helpers";

import { apiGetProductByCategory, apiGetProductDetail } from "../../../api/product";

const ProductDetail = () => {
  const { current } = useSelector((state) => state.user)

  const titleRef = useRef()
  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  // const [category, setCategory] = useState(null)
  const [update, setUpdate] = useState(false)
  const [quantity, setQuantity] = useState(1);

  const handleQuantity = useCallback(
    (number) => {
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [quantity]
  );
  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === "minus" && quantity === 1) return;
      if (flag === "minus") setQuantity((prev) => +prev - 1);
      if (flag === "plus") setQuantity((prev) => +prev + 1);
    },
    [quantity]
  );
  const handleAddToCart = async () => {};

  const fetchProductDetail = async () => {
    const response = await apiGetProductDetail(pid);
    if (response.success) {
      setProduct(response.productDetail)
      setCurrentImage(response.productDetail?.thumb)
    }
  };

  const fetchRelatedProducts = async () => {
    const response = await apiGetProductByCategory(category);
    if (response.success) setRelatedProduct(response.productByCategory)
  };

  const handleClickImage = (e, el) => {
    e.stopPropagation()
    setCurrentImage(el)
  }

  useEffect(() => {
    if (pid) {
      fetchProductDetail();
      fetchRelatedProducts();
    }
    titleRef.current.scrollIntoView({ block: "center" })
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
        <div ref={titleRef} className="w-main">
          <h1 className="text-xl font-medium">{title}</h1>
          <Breadcrumbs title={title} category={product?.category?.name} />
        </div>
      </div>
      <div className="w-main m-auto mt-10 flex">
        <div className="flex flex-col gap-4 w-2/4">
          <div className="w-full h-full flex items-center overflow-hidden">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "",
                  isFluidWidth: true,
                  src: product?.thumb || currentImage,
                },
                largeImage: {
                  src: product?.thumb || currentImage,
                  width: 1800,
                  height: 1500,
                },
              }}
            />
            {/* <img src={product?.thumb} alt="" className="w-full h-full object-contain p-2" /> */}
          </div>
          <div className="w-full">
            <Slider {...settings}>
              {product?.images?.map((el) => (
                <div className="w-[100px] h-[100px] px-2" key={el}>
                  <img
                    onClick={(e) => handleClickImage(e, el)}
                    src={el}
                    alt=""
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="w-2/5 flex flex-col gap-4 ml-10">
          <h2 className="text-[30px] font-semibold">
            {`${formatPrice(product?.price)} VNĐ`}
          </h2>
          <div className="flex items-center gap-1">
            {renderStar(product?.totalRating)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className="text-sm text-main italic ml-2">{`{ ${product?.rating.length} } lượt đánh giá`}</span>
          </div>
          <ul className="list-disc text-gray-500 pl-4">
            {product?.description?.length > 1 &&
              product?.description?.map((el) => (
                <li className="leading-6" key={el}>
                  {el}
                </li>
              ))}
            {product?.description?.length === 1 && (
              <div
                className="text-sm line-clamp-[10] mb-8"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product?.description[0]),
                }}></div>
            )}
          </ul>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Số lượng</span>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
            <ButtonV2 handleOnClick={handleAddToCart} fw>
              Thêm vào giỏ hàng
            </ButtonV2>
          </div>
        </div>
      </div>
      <div className="w-main m-auto mt-10 border-y-4 border-main">
        <ProductReview />
      </div>
      <div className="w-main m-auto mt-10">
        <h3 className="text-2xl font-semibold">Sản phẩm tương tự có thể bạn sẽ thích</h3>
        <div className="my-4 px-4 py-6 border-t-4 border-main"><ProductSlider normal={true} products={relatedProduct}/></div>
        <div className="h-[100px] w-full"></div>
      </div>
    </div>
  );
};

export default ProductDetail;
