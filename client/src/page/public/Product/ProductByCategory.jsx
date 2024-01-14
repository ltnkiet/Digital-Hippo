import React, { useEffect, useState, useCallback } from 'react'
import {
  useParams,
  useSearchParams,
  createSearchParams,
  useNavigate,
} from "react-router-dom"

import { Breadcrumbs} from "../../../components";


import { apiGetProductByCategory, apiGetProductDetail } from "../../../api/product";
const ProductByCategory = () => {
  const [product, setProduct] = useState(null);
  const { category } = useParams()

  const fetchProduct = async () => {
    const response = await apiGetProductByCategory(category);
    if (response.success) setProduct(response.productByCategory)
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="w-full">
      <div className="h-[80px] flex items-center justify-center bg-gray-200">
        <div className="w-main">
          <h1 className="text-xl font-medium">{category}</h1>
          <Breadcrumbs category={product?.category?.name} />
        </div>
      </div>
      <div className="lg:w-main border p-4 flex lg:pr-4 pr-8 flex-col md:flex-row gap-4 md:justify-between mt-8 m-auto">
        <div className="w-4/5 flex-auto flex flex-col gap-3">
          <span className="font-semibold text-sm">Xem theo</span>
          <div className="flex items-center gap-4">
            {/* <SearchItem
              name="price"
              activeClick={activeClick}
              changeActiveFitler={changeActiveFitler}
              type="input"
            /> */}
            {/* <SearchItem
              name="color"
              activeClick={activeClick}
              changeActiveFitler={changeActiveFitler}
            /> */}
          </div>
        </div>
        <div className="w-1/5 flex flex-col gap-3">
          <span className="font-semibold text-sm">Sắp xếp theo</span>
          <div className="w-full">
            {/* <InputSelect
              changeValue={changeValue}
              value={sort}
              options={sorts}
            /> */}
          </div>
        </div>
      </div>
      <div className='h-[500px]'></div>
    </div>
  )
}

export default ProductByCategory