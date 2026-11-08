import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/auth-slice";
import { apiSlice } from "./services/api-slice";
import { env } from "@/config";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: !env.IS_PRODUCTION,
  });
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
