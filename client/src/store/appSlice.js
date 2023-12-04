import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
  },
  reducers: {
    // logout: (state) => {
    //   state.isLoading = false
    // }
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    builder.addCase(actions.getCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    });
    // Khi thực hiện action thất bại (Promise rejected)
    builder.addCase(actions.getCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export const {} = appSlice.actions; 

export default appSlice.reducer;
