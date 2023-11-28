import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.isLoading = false
    }
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    // Bắt đầu thực hiện action login (Promise pending)
    builder.addCase(actions.getCategory.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = true;
    });

    // Khi thực hiện action thành công (Promise fulfilled)
    builder.addCase(actions.getCategory.fulfilled, (state, action) => {
      // Tắt trạng thái loading, lưu thông tin user vào store
      state.isLoading = false;
      state.categories = action.payload;
    });

    // Khi thực hiện action thất bại (Promise rejected)
    builder.addCase(actions.getCategory.rejected, (state, action) => {
      // Tắt trạng thái loading, lưu thông báo lỗi vào store
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

// eslint-disable-next-line
export const {} = appSlice.actions; 

export default appSlice.reducer;
