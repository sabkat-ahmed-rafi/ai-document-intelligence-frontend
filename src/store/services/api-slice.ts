import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { logout } from "@/features/auth/slices/auth-slice";
import { env } from "@/config";

// Mutex instance to serialize concurrent re-authentication requests
const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  credentials: "include", // All auth cookies (access_token, refresh_token) are handled automatically
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if a token refresh is currently in flight before firing this query
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extraOptions);

  const endpointUrl = typeof args === "string" ? args : args.url;
  const isAuthEndpoint =
    endpointUrl.includes("/auth/login") ||
    endpointUrl.includes("/auth/refresh-token") ||
    endpointUrl.includes("/auth/register");

  if (result.error && result.error.status === 401 && !isAuthEndpoint) {
    // Only one request acquires the mutex to call /auth/refresh-token
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
          },
          api,
          extraOptions
        );

        if (!refreshResult.error) {
          // Refresh succeeded and cookies rotated; retry the failed request
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Refresh token is expired or invalid; sign out user and invalidate cache
          api.dispatch(logout());
        }
      } finally {
        // Release the mutex for all other queued requests
        release();
      }
    } else {
      // Another request already triggered refresh; wait for it to unlock then retry
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
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
