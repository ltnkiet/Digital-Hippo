import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Login,
  Public,
  Register,
  ResetPassword,
  Brand,
  Products,
  ProductDetail,
  AboutUs,
} from "././page/public";
import path from "./utils/path";
import { getCategory } from "./store/app/asyncAction";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategory()); // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.BRAND} element={<Brand />} />
          <Route path={path.ABOUT_US} element={<AboutUs />} />
          <Route path={path.PRODUCT_DETAIL__ID__TITLE} element={<ProductDetail />}/>
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
          <Route path={path.REGISTER} element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
