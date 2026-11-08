"use client";

import { useSyncExternalStore } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutUserMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} from "../api/auth-api";
import { logout as logoutAction } from "../slices/auth-slice";
import { LoginPayload, RegisterPayload, User } from "../types";
import { getErrorMessage } from "@/lib/error-utils";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Automatically validates cookie session with backend on client load (skipped during SSR prerender)
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: !isClient,
  });

  const currentUser = user || profileData?.data || null;
  const isAuthenticated = Boolean(currentUser);
  const isLoading = !isClient || (!isInitialized && isProfileLoading);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutUserMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [verifyResetCodeMutation] = useVerifyResetCodeMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [changePasswordMutation] = useChangePasswordMutation();

  const login = async (payload: LoginPayload): Promise<User> => {
    try {
      const response = await loginMutation(payload).unwrap();
      if (!response.data?.user) {
        throw new Error("Invalid response from server");
      }
      return response.data.user;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    try {
      const response = await registerMutation(payload).unwrap();
      if (!response.data) {
        throw new Error("Failed to register user");
      }
      return response.data;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Clear client state even if network fails
      dispatch(logoutAction());
    }
  };

  const forgotPassword = async (email: string): Promise<string> => {
    try {
      const response = await forgotPasswordMutation({ email }).unwrap();
      return response.message || "Reset code sent to your email";
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const verifyResetCode = async (email: string, code: string): Promise<string> => {
    try {
      const response = await verifyResetCodeMutation({ email, code }).unwrap();
      if (!response.data?.reset_token) {
        throw new Error("Invalid reset code response");
      }
      return response.data.reset_token;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string): Promise<string> => {
    try {
      const response = await resetPasswordMutation({
        reset_token: resetToken,
        new_password: newPassword,
      }).unwrap();
      return response.message || "Password successfully reset";
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<string> => {
    try {
      const response = await changePasswordMutation({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();
      return response.message || "Password changed successfully";
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  return {
    user: currentUser,
    isAuthenticated,
    isLoading,
    isLoginLoading,
    isRegisterLoading,
    isLogoutLoading,
    login,
    register,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    changePassword,
    refreshUser: refetchProfile,
  };
}
