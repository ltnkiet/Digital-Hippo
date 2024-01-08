import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,  
    token: null
  },
  reducers: {
    register: (state, action) => {
      console.log(action)
      state.isLoggedIn = action.payload.isLoggedIn
      state.current = action.payload.userData
      state.token = action.payload.token
    }
  },
  // Code logic xử lý async action
  // extraReducers: (builder) => {
  //   builder.addCase(actions.getNewuser.pending, (state) => {
  //     state.isLoading = true;
  //   });
  //   builder.addCase(actions.getNewuser.fulfilled, (state, action) => {
  //     state.isLoading = false;
  //     state.newusers = action.payload;
  //   });
  //   // Khi thực hiện action thất bại (Promise rejected)
  //   builder.addCase(actions.getNewuser.rejected, (state, action) => {
  //     state.isLoading = false;
  //     state.errorMessage = action.payload.message;
  //   });
  // },
});

export const { register } = userSlice.actions; 

export default userSlice.reducer;
