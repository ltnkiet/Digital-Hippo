import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
    msg: ""
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
  },
  // Code logic xử lý async action
  extraReducers: (builder) => {
    builder.addCase(actions.getCurrent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.current = action.payload;
      state.isLoggedIn = true
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
