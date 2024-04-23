import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
import DOMPurify from "dompurify";
import clsx from "clsx";
import {
  Breadcrumbs,
  SelectQuantity,
  ButtonV2,
  ProductReview,
  ProductSlider,
} from "components";
import { formatPrice, renderStar } from "utils/helpers";
import { apiGetProductByCategory, apiGetProductDetail } from "api";
import withBaseComponent from "hocs/withBaseComponent";
import { getCurrent } from "store/user/asyncActions";
import { apiUpdateCart } from "api";
import Swal from "sweetalert2";
import { createSearchParams } from "react-router-dom";
import path from "utils/path";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProductDetail = ({ isQuickView, data, location, dispatch, navigate }) => {
  const params = useParams();
  const { current } = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [update, setUpdate] = useState(false);
  const [varriant, setVarriant] = useState(null);
  const [pid, setPid] = useState(null);
  const [category, setCategory] = useState(null);

  const [currentProduct, setCurrentProduct] = useState({
    title: "",
    thumb: "",
    images: "",
    price: "",
    color: "",
  });

  useEffect(() => {
    if (data) {
      setPid(data.pid);
      setCategory(data.category);
    } else if (params && params.pid) {
      setPid(params.pid);
      setCategory(params.category);
    }
  }, [data, params]);

  const fetchProductDetail = async () => {
    const response = await apiGetProductDetail(pid);
    if (response.success) {
      setProduct(response.productDetail);
      setCurrentImage(response.productDetail?.thumb);
    }
  };

  const fetchRelatedProducts = async () => {
    const response = await apiGetProductByCategory(category);
    if (response.success) setRelatedProduct(response.productByCategory);
  };

  useEffect(() => {
    if (varriant) {
      setCurrentProduct({
        title: product?.varriants?.find((el) => el.sku === varriant)?.title,
        color: product?.varriants?.find((el) => el.sku === varriant)?.color,
        images: product?.varriants?.find((el) => el.sku === varriant)?.images,
        price: product?.varriants?.find((el) => el.sku === varriant)?.price,
        thumb: product?.varriants?.find((el) => el.sku === varriant)?.thumb,
      });
    } else {
      setCurrentProduct({
        title: product?.title,
        color: product?.color,
        images: product?.images || [],
        price: product?.price,
        thumb: product?.thumb,
      });
    }
  }, [varriant, product]);

  useEffect(() => {
    if (pid) {
      fetchProductDetail();
      fetchRelatedProducts();
    }
  }, [pid]);

  useEffect(() => {
    if (pid) fetchProductDetail();
  }, [update]);

  const rerender = useCallback(() => {
    setUpdate(!update);
  }, [update]);

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

  const handleAddToCart = async () => {
    if (!current)
      return Swal.fire({
        title: "Khoan..",
        text: "Vui lòng đăng nhập!",
        icon: "info",
        cancelButtonText: "Không phải bây giờ!",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập ngay",
      }).then(async (rs) => {
        if (rs.isConfirmed)
          navigate({
            pathname: `/${path.LOGIN}`,
            search: createSearchParams({
              redirect: location.pathname,
            }).toString(),
          });
      });
    const response = await apiUpdateCart({
      pid,
      color: currentProduct.color || product.color,
      quantity,
      price: currentProduct.price || product.price,
      thumbnail: currentProduct.thumb || product.thumb,
      title: currentProduct.title || product.title,
    });
    if (response.success) {
      toast.success(response.msg);
      dispatch(getCurrent());
    } else toast.error(response.msg);
  };

  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentImage(el);
  };

  const handleSetVarriant = (sku) => {
    const selectedVarriant = product?.varriants?.find((el) => el.sku === sku);
    if (selectedVarriant) {
      setVarriant(sku);
      setCurrentImage(selectedVarriant.thumb);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
  };

  return (
    <div className={clsx("w-full")}>
      {!isQuickView && (
        <div className="h-[80px] flex items-center justify-center bg-gray-200">
          <div  className="w-main">
            <h1 className="text-xl font-medium">
              {currentProduct.title || product?.title}
            </h1>
            <Breadcrumbs
              title={currentProduct.title || product?.title}
              category={product?.category?.name}
            />
          </div>
        </div>
      )}
      <div

        onClick={(e) => e.stopPropagation()}
        className={clsx(
          // className="w-main m-auto mt-10 flex">
          "bg-white m-auto mt-4 flex gap-5",
          isQuickView
            ? "max-w-[900px] gap-16 p-8 max-h-[80vh] overflow-y-auto"
            : "w-main"
        )}>
        <div
          className={clsx("flex flex-col gap-4 w-2/5", isQuickView && "w-1/2")}>
          <div className="w-[480px] h-[480px] flex items-center">
            <ReactImageMagnify
              {...{
                smallImage: {
                  isFluidWidth: true,
                  src: currentImage,
                },
                largeImage: {
                  src: currentImage,
                  width: 1200,
                  height: 900,
                },
              }}
            />
          </div>
          <div className="w-[450px]">
            <Slider className="flex gap-2 justify-between" {...settings}>
              {currentProduct.images?.length === 0 &&
                product?.images?.map((el) => (
                  <div className="w-[100px] h-[100px] px-2 flex-1" key={el}>
                    <img
                      onClick={(e) => handleClickImage(e, el)}
                      src={el}
                      alt=""
                      className="w-full h-full cursor-pointer object-contain p-1"
                    />
                  </div>
                ))}
              {currentProduct.images?.length > 0 &&
                currentProduct.images?.map((el) => (
                  <div className="w-[100px] h-[100px] px-2 flex-1" key={el}>
                    <img
                      onClick={(e) => handleClickImage(e, el)}
                      src={el}
                      alt=""
                      className="w-full h-full cursor-pointer object-contain p-1"
                    />
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <div className="w-2/5 flex flex-col gap-4 px-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold">
              {`${formatPrice(currentProduct.price || product?.price)} VNĐ`}
            </h2>
            <span className="text-sm text-main">{`In stock: ${product?.quantity}`}</span>
          </div>
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
          <div className="my-4 flex gap-4">
            <span className="font-bold">Màu sắc:</span>
            <div className="flex flex-wrap gap-4 items-center w-full">
              <div
                onClick={() => setVarriant(null)}
                className={clsx(
                  "flex items-center gap-2 p-2 border cursor-pointer",
                  !varriant && "border-red-500"
                )}>
                <img
                  src={product?.thumb}
                  alt="thumb"
                  className="w-8 h-8 rounded-md object-cover"
                />
                <span className="flex flex-col">
                  <span>{product?.color}</span>
                  <span className="text-sm">{formatPrice(product?.price)}</span>
                </span>
              </div>
              {product?.varriants?.map((el) => (
                <div
                  key={el.sku}
                  onClick={() => handleSetVarriant(el.sku)}
                  className={clsx(
                    "flex items-center gap-2 p-2 border cursor-pointer",
                    varriant === el.sku && "border-red-500"
                  )}>
                  <img
                    src={el.thumb}
                    alt="thumb"
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <span className="flex flex-col">
                    <span>{el.color}</span>
                    <span className="text-sm">{formatPrice(el.price)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
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
      {!isQuickView && (
        <div className="w-main m-auto mt-10 border-y-4 border-main">
          <ProductReview
            totalRating={product?.totalRating}
            rating={product?.rating}
            nameProduct={product?.title}
            pid={product?._id}
            rerender={rerender}
          />
        </div>
      )}
      {!isQuickView && (
        <div className="w-main m-auto mt-10">
          <h3 className="text-2xl font-semibold">
            Sản phẩm tương tự có thể bạn sẽ thích
          </h3>
          <div className="my-4 px-4 py-6 border-t-4 border-main">
            <ProductSlider normal={true} products={relatedProduct} />
          </div>
          <div className="h-[100px] w-full"></div>
        </div>
      )}
    </div>
  );
};

export default withBaseComponent(ProductDetail);
