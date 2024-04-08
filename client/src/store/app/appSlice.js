import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    brands: null,
    coupons: null,
    isLoading: false,
    isShowModal: false,
    modalChildren: null,
    isShowCart: false,
  },
  reducers: {
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal;
      state.modalChildren = action.payload.modalChildren;
    },
    showCart: (state) => {
      state.isShowCart = state.isShowCart === false ? true : false;
    },
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    builder
      // Get Category
      .addCase(actions.getCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(actions.getCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(actions.getCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message;
      })
      // Gett Brand
      .addCase(actions.getBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(actions.getBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
      })
      .addCase(actions.getBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message;
      })
      // Gett Coupoun
      .addCase(actions.getCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(actions.getCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
      })
      .addCase(actions.getCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message;
      });
  },
});

export const { showModal, showCart } = appSlice.actions;

export default appSlice.reducer;
