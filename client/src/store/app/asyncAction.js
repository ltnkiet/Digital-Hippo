import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const getCategory = createAsyncThunk(
  "app/categories",
  async (data, { rejectWithValue }) => {
    const response = await api.apiGetCategory();
    if (!response.data.success) return rejectWithValue(response);
    return response.data.category;
  }
);
