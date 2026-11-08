import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "@/features/auth/slices/auth-slice";
import { env } from "@/config";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  credentials: "include", // All auth cookies (access_token, refresh_token) are handled automatically
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const endpointUrl = typeof args === "string" ? args : args.url;
  const isAuthEndpoint =
    endpointUrl.includes("/auth/login") ||
    endpointUrl.includes("/auth/refresh-token") ||
    endpointUrl.includes("/auth/register");

  if (result.error && result.error.status === 401 && !isAuthEndpoint) {
    // Backend reads the httpOnly refresh_token cookie and rotates the access_token cookie
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (!refreshResult.error) {
      // Cookie was updated by backend, retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear client user session
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Collections", "Documents", "Threads"],
  endpoints: () => ({}),
});
