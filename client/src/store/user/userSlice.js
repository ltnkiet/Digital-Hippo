import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
    msg: "",
    currentCart: []
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.isLoggedIn = false
      state.current = null
      state.token = null
      state.isLoading = false
      state.msg = ''
  },
    clearMessage: (state) => {
      state.msg = ''
    },
    updateCart: (state, action) => {
      const { pid, color, quantity } = action.payload
      const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
      state.currentCart = updatingCart.map(el => {
        if (el.color === color && el.products?._id === pid) {
          return { ...el, quantity }
        } else return el
      })
  }
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    builder.addCase(actions.getCurrent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.current = action.payload;
      state.isLoggedIn = true;
      state.currentCart = action.payload.cart

    });
    // Khi thực hiện action thất bại (Promise rejected)
    builder.addCase(actions.getCurrent.rejected, (state, action) => {
      state.isLoading = false;
      state.current = null;
      state.isLoggedIn = false
      state.token = null
      state.msg = 'Thời hạn đăng nhập đã hết. Vui lòng đăng nhập lại!'
    });
  },
});

export const { login,logout, clearMessage } = userSlice.actions;

export default userSlice.reducer;
