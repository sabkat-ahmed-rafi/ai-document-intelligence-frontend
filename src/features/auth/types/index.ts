export interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AccessTokenData {
  access_token: string;
  token_type: string;
}

export interface LoginResponseData {
  user: User;
  token: AuthTokens;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface PasswordResetAuthorization {
  reset_token: string;
  expires_in_seconds: number;
}

export interface ResetPasswordPayload {
  reset_token: string;
  new_password: string;
}
