import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSLice";
import authReducer from "./features/auth/authSlice";
import { api } from "./api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
