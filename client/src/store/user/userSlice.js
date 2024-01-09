import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
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
    });
    // Khi thực hiện action thất bại (Promise rejected)
    builder.addCase(actions.getCurrent.rejected, (state, action) => {
      state.isLoading = false;
      state.current = null;
    });
  },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
