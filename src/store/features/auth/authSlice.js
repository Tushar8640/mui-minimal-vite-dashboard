import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    email: "",
    name: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
      localStorage.setItem("auth", JSON.stringify(action.payload));
    },
    logOut: (state) => {
      state.user.email = "";
      state.user.name = "";
      localStorage.removeItem("auth");
    },
  },
});

// Action creators are generated for each case reducer function
export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
