import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const getNewProduct = createAsyncThunk(
  "product/newProducts",
  async (data, { rejectWithValue }) => {
    const response = await api.apiGetProduct({sort: "-createdAt"});
    if (!response.success) return rejectWithValue(response);
    return response.productList;
  }
);
