import { API_ENDPOINTS } from "@/config";
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "@/types/api";
import { apiService } from "./api";

export const authService = {
  login: async (credentails: LoginRequest): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentails);
  },

  register: async (credentials: RegisterRequest): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
  },

  logout: async (): Promise<void> => {
    return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<void> => {
    return apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
  },
};
