import withBaseComponent from "hocs/withBaseComponent";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Breadcrumbs,
  ProductCard,
  SearchItem,
  InputSelect,
  Pagination,
  Loading,
} from "components";
import { apiGetProduct } from "api";
import path from "utils/path";

const Products = ({ navigate, dispatch }) => {
  const titleRef = useRef();
  const [products, setProducts] = useState(null);
  const [params] = useSearchParams();

  const fetchProductList = async (queries) => {
    const response = await apiGetProduct(queries);
    if (response.success) setProducts(response);
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    let priceQuery = {};
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      };
      delete queries.price;
    } else {
      if (queries.from) queries.price = { gte: queries.from };
      if (queries.to) queries.price = { lte: queries.to };
    }
    delete queries.to;
    delete queries.from;
    const q = { ...priceQuery, ...queries };
    fetchProductList(q);
    window.scrollTo(0, 0);
  }, [params]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [products]);

  return (
    <div className="w-full">
      {products === null ? (
        <div className="flex items-start justify-center p-10">
          <Loading />
        </div>
      ) : (
        <>
          <div
            ref={titleRef}
            className="h-[80px] flex items-center justify-center bg-gray-200">
            <div className="w-main">
              <h1 className="text-xl font-medium uppercase">
                Danh sách sản phẩm
              </h1>
              <Breadcrumbs product={path.PRODUCTS} />
            </div>
          </div>
          <div className="mt-8 w-main m-auto grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
            {products?.productList && products?.productList.length === 0 ? (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              products?.productList?.map((el) => (
                <ProductCard
                  key={el._id}
                  pid={el._id}
                  data={el}
                  normal={true}
                />
              ))
            )}
          </div>
          <div className="w-main m-auto my-4 flex justify-center">
            <Pagination totalCount={products?.counts} />
          </div>
          <div className="h-[200px]"></div>
        </>
      )}
    </div>
  );
};

export default withBaseComponent(Products);
