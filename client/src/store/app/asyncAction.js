import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const getCategory = createAsyncThunk(
  "app/categories",
  async (data, { rejectWithValue }) => {
    const response = await api.apiGetCategory();
    if (!response.success) return rejectWithValue(response);
    console.log(response.category)
    return response.category;
  }
);
