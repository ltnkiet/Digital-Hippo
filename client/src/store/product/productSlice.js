import { createSlice } from "@reduxjs/toolkit";
import * as actions from './asyncActions'

export const productSlice = createSlice({
  name: "product",
  initialState: {
    newProducts: null,
    errorMessage: "",
    isLoading: false
  },
  reducers: {
    
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    builder.addCase(actions.getNewProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getNewProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newProducts = action.payload;
    });
    // Khi thực hiện action thất bại (Promise rejected)
    builder.addCase(actions.getNewProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export const {} = productSlice.actions; 

export default productSlice.reducer;
