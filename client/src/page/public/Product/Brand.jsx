import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "components";
import { apiGetBrand } from "api";

const Brand = () => {
  const [listBrand, setListBrand] = useState(null);
  const [params] = useSearchParams();

  const fetch = async (params) => {
    const response = await apiGetBrand({
      ...params,
      limit: 15,
    });
    if (response.success) setListBrand(response);
  };

  useEffect(() => {
    const searchParams = Object.fromEntries([...params]);
    fetch(searchParams);
  }, [params]);

  return (
    <div className="w-full">
      <div className="mt-8 w-main m-auto grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-10">
        {listBrand?.brands?.map((el) => (
          <div className="w-28">
            <img
              src={el?.thumb}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
      <div className="w-main m-auto my-4 flex justify-center">
        <Pagination totalCount={listBrand?.counts} />
      </div>
      <div className="h-[200px]"></div>
    </div>
  );
};

export default Brand;
