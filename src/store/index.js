import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSLice";
import { api } from "./api";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
