import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { baseURL } from "../../Components/utils";
import { logOut, setCredentials } from "../Slices/authSlice";

const baseApi = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
const baseApiWithRefresh = async (args, api, extraOptions) => {
  let result = await baseApi(args, api, extraOptions);
  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const refreshToken = api.getState().auth.refreshToken;
    const data = { refreshToken: refreshToken };
    const refreshResult = await axios.post(
      `${baseURL}users/api/auth/refresh/`,
      data
    );
    if (refreshResult?.data) {
      const accessToken = refreshResult.data.accessToken;
      const refreshToken = refreshResult.data.refreshToken;
      const auth = refreshResult.data.user;
      api.dispatch(setCredentials({ accessToken, refreshToken, auth }));
      localStorage.setItem("userCredential", data.accessToken);
      localStorage.setItem("refreshUserCredential", data.refreshToken);
      localStorage.setItem("userData", data.user);
      result = await baseApi(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};
export const apiSlice = createApi({
  baseQuery: baseApiWithRefresh,
  tagTypes: ["premise","premise-post", "premise-comment, premise-like, premise_user, premise-msg, reply-comment, premise-hidden-count, sp-porject"],
  endpoints: (builder) => ({}),
});
