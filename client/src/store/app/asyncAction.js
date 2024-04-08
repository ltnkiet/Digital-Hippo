import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "api";

export const getCategory = createAsyncThunk(
  "app/categories",
  async (data, { rejectWithValue }) => {
    const response = await api.apiGetCategory();
    if (!response.success) return rejectWithValue(response);
    return response.category;
  }
);

export const getBrand = createAsyncThunk(
  "app/brands",
  async (data, { rejectWithValue }) => {
    const response = await api.apiGetBrand();
    if (!response.success) return rejectWithValue(response);
    return response.brands;
  }
);

export const getCoupon = createAsyncThunk(
  "app/coupons",
  async (data, { rejectWithValue }) => {
    const response = await api.apiGetCoupons();
    if (!response.success) return rejectWithValue(response);
    return response.coupons;
  }
);
