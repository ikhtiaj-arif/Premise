import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { apiSlice } from "./EndPoints/faseBaseQuery";
import authReducer from "./Slices/authSlice";
import  useReducer  from "./Slices/userSlice";
import  premiseReducer  from "./Slices/premiseSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    user: useReducer,
    premise: premiseReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

