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
  ProductByCategory,
  DetailCart,
} from "page/public";
import {
  Layout,
  Dashboard,
  ManageProduct,
  ManageCategory,
  ManageUser,
  ManageOrder,
  CreateProduct,
  CreateCategory,
  ManageBrand,
  CreateBrand,
  ManageCoupons,
  CreateCoupons,
} from "page/admin";
import {
  LayoutMember,
  CheckOut,
  Profile,
  OrderHistory,
  WishList,
} from "page/member";
import path from "utils/path";
import { getCategory, getBrand } from "store/app/asyncAction";
import { showCart } from "store/app/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ProductCart } from "components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isShowModal, modalChildren, isShowCart } = useSelector(
    (state) => state.app
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBrand()); // eslint-disable-next-line
  }, []);

  return (
    <div>
      {isShowCart && (
        <div
          onClick={() => dispatch(showCart())}
          className="absolute inset-0 bg-overlay-70 z-50 flex justify-end">
          <ProductCart />
        </div>
      )}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        {/* Check Out */}
        <Route path={path.CHECKOUT} element={<CheckOut />} />
        {/* Public */}
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.ALL} element={<Home />} />
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.BRAND} element={<Brand />} />
          <Route path={path.ABOUT_US} element={<AboutUs />} />
          <Route
            path={path.PRODUCT_DETAIL__ID__TITLE}
            element={<ProductDetail />}
          />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route
            path={path.PRODUCTS_CATEGORY}
            element={<ProductByCategory />}
          />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        {/* Auth */}
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.REGISTER} element={<Register />} />
        {/* Admin */}
        <Route path={path.ADMIN} element={<Layout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />

          <Route path={path.MANAGE_PRODUCTS} element={<ManageProduct />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProduct />} />
          
          <Route path={path.MANAGE_COUPON} element={<ManageCoupons />} />
          <Route path={path.CREATE_COUPON} element={<CreateCoupons />} />

          <Route path={path.MANAGE_CATEGORY} element={<ManageCategory />} />
          <Route path={path.CREATE_CATEGORY} element={<CreateCategory />} />

          <Route path={path.MANAGE_BRAND} element={<ManageBrand />} />
          <Route path={path.CREATE_BRAND} element={<CreateBrand />} />
          
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
        </Route>
        {/* Member */}
        <Route path={path.MEMBER} element={<LayoutMember />}>
          <Route path={path.PERSONAL} element={<Profile />} />
          <Route path={path.MY_CART} element={<DetailCart />} />
          <Route path={path.HISTORY} element={<OrderHistory />} />
          <Route path={path.WISHLIST} element={<WishList />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        theme="light"
        autoClose={500}
        rtl={false}
        newestOnTop={false}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
