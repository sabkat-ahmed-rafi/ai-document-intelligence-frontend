import { apiSlice } from "@/store/services/api-slice";
import {
  User,
  LoginPayload,
  RegisterPayload,
  LoginResponseData,
  ApiResponse,
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  PasswordResetAuthorization,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from "../types";
import { setUser, logout } from "../slices/auth-slice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Register User
    register: builder.mutation<ApiResponse<User>, RegisterPayload>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    // 2. Login User (Cookies set automatically by backend)
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user) {
            dispatch(setUser(data.data.user));
          }
        } catch {
          // Handled in component
        }
      },
      invalidatesTags: ["User"],
    }),

    // 3. Get Profile (/me - uses session cookie)
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUser(data.data));
          }
        } catch {
          dispatch(setUser(null));
        }
      },
    }),

    // 4. Logout User (Cookies deleted by backend)
    logoutUser: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        }
      },
      invalidatesTags: ["User"],
    }),

    // 5. Forgot Password (Request 6-digit code)
    forgotPassword: builder.mutation<ApiResponse<null>, ForgotPasswordPayload>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // 6. Verify Password Reset Code
    verifyResetCode: builder.mutation<
      ApiResponse<PasswordResetAuthorization>,
      VerifyResetCodePayload
    >({
      query: (body) => ({
        url: "/auth/verify-password-reset-code",
        method: "POST",
        body,
      }),
    }),

    // 7. Reset Password
    resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordPayload>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    // 8. Change Password (Authenticated via cookie)
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
