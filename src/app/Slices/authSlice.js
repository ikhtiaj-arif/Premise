import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
let initialState = {
  accessToken: null,
  refreshToken: null,
};
if (accessToken && refreshToken) {
  initialState.accessToken = accessToken;
  initialState.refreshToken = refreshToken;
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logOut: (state, action) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      Cookies.remove("sessionid");
    },
  },
});
export default authSlice.reducer;
export const { setCredentials, logOut } = authSlice.actions;
