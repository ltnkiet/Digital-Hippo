import withBaseComponent from 'hocs/withBaseComponent'
import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams, createSearchParams } from "react-router-dom"
import { Breadcrumbs, ProductCard, SearchItem, InputSelect, Pagination} from "components";
import { apiGetProduct } from "api";
import { sorts } from 'utils/contant'
import path from 'utils/path'

const Products = ({navigate}) => {
  const [products, setProducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null)
  const [sort, setSort] = useState("")
  const [params] = useSearchParams()

  const fetchProductList = async (queries) => {
    const response = await apiGetProduct(queries);
    if (response.success) setProducts(response)
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    let priceQuery = {}
    if (queries.to && queries.from) {
      priceQuery = {
        $and: [
          { price: { gte: queries.from } },
          { price: { lte: queries.to } },
        ],
      }
      delete queries.price
    } else {
      if (queries.from) queries.price = { gte: queries.from }
      if (queries.to) queries.price = { lte: queries.to }
    }
    delete queries.to
    delete queries.from
    const q = { ...priceQuery, ...queries }
    fetchProductList(q);
    window.scrollTo(0, 0)
  }, [params]);

  // const changeActiveFitler = useCallback(
  //   (name) => {
  //     if (activeClick === name) setActiveClick(null)
  //     else setActiveClick(name)
  //   }, [activeClick]
  // )

  // const changeValue = useCallback(
  //   (value) => {setSort(value)},
  //   [sort]
  // )

  useEffect(() => {
    if (sort) {
      navigate({
        pathname: `/${path.PRODUCTS}`,
        search: createSearchParams({ sort }).toString(),
      })
    }
  }, [sort])

  return (
    <div className="w-full">
    <div className="h-[80px] flex items-center justify-center bg-gray-200">
      <div className="w-main">
        <h1 className="text-xl font-medium uppercase">Danh sách sản phẩm</h1>
        <Breadcrumbs product={path.PRODUCTS}/>
      </div>
    </div>
    {/* <div className="lg:w-main border p-4 flex lg:pr-4 pr-8 flex-col md:flex-row gap-4 md:justify-between mt-8 m-auto">
      <div className="w-4/5 flex-auto flex flex-col gap-3">
        <span className="font-semibold text-sm">Xem theo</span>
        <div className="flex items-center gap-4">
          <SearchItem
            name="Giá"
            activeClick={activeClick}
            changeActiveFitler={changeActiveFitler}
            type="input"
          />
          <SearchItem
            name="Màu"
            activeClick={activeClick}
            changeActiveFitler={changeActiveFitler}
          />
        </div>
      </div>
      <div className="w-1/5 flex flex-col gap-3">
        <span className="font-semibold text-sm">Sắp xếp theo</span>
        <div className="w-full">
          <InputSelect
            changeValue={changeValue}
            value={sort}
            options={sorts}
          />
        </div>
      </div>
    </div> */}
    <div className="mt-8 w-main m-auto grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
      {products?.productList?.map(el => (
        <ProductCard key={el._id} pid={el._id} data={el} normal={true}/>
      ))}
    </div>
    <div className="w-main m-auto my-4 flex justify-center">
      <Pagination totalCount={products?.counts} />
    </div>
    <div className='h-[200px]'></div>
  </div>
  )
}

export default withBaseComponent(Products)