import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import {
  API_CONFIG,
  AUTH_CONFIG,
  DEFAULT_HEADERS,
  ERROR_CODES,
  getCurrentConfig,
} from "../config";
import { ApiResponse, AuthResponse, RefreshTokenRequest } from "../types/api";

/**
 * Custom error class for API errors
 */
export class ApiServiceError extends Error {
  public statusCode: number;
  public code: string;
  public details?: Record<string, any>;
  public isNetworkError: boolean;
  public isAuthError: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = ERROR_CODES.UNKNOWN_ERROR,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = "ApiServiceError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isNetworkError = statusCode === 0 || statusCode >= 500;
    this.isAuthError = statusCode === 401 || statusCode === 403;
  }
}

/**
 * Retry configuration for failed requests
 */
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition: (error: AxiosError) => boolean;
}

/**
 * Token state management
 */
interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
}

/**
 * API service state
 */
interface ApiServiceState {
  isRefreshing: boolean;
  failedQueue: {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }[];
}

// Global state (could be moved to a state management solution later)
let tokenState: TokenState = {
  accessToken: null,
  refreshToken: null,
  tokenExpiry: null,
};

let apiServiceState: ApiServiceState = {
  isRefreshing: false,
  failedQueue: [],
};

/**
 * Token management functions
 */
export const tokenManager = {
  /**
   * Initialize tokens from secure storage
   */
  async initialize(): Promise<void> {
    try {
      const [accessToken, refreshToken, expiry] = await Promise.all([
        SecureStore.getItemAsync(AUTH_CONFIG.ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(AUTH_CONFIG.REFRESH_TOKEN_KEY),
        SecureStore.getItemAsync("token_expiry"),
      ]);

      tokenState = {
        accessToken,
        refreshToken,
        tokenExpiry: expiry ? parseInt(expiry) : null,
      };
    } catch (error) {
      console.error("Failed to initialize tokens:", error);
    }
  },

  /**
   * Store tokens securely and update in-memory cache
   */
  async setTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number
  ): Promise<void> {
    try {
      const expiry = Date.now() + expiresIn * 1000;

      await Promise.all([
        SecureStore.setItemAsync(AUTH_CONFIG.ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync("token_expiry", expiry.toString()),
      ]);

      tokenState = {
        accessToken,
        refreshToken,
        tokenExpiry: expiry,
      };
    } catch (error) {
      console.error("Failed to store tokens:", error);
      throw new ApiServiceError(
        "Failed to store authentication tokens",
        500,
        ERROR_CODES.SERVER_ERROR
      );
    }
  },

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return tokenState.accessToken;
  },

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return tokenState.refreshToken;
  },

  /**
   * Check if access token is expired or will expire soon
   */
  isTokenExpired(): boolean {
    if (!tokenState.tokenExpiry) return true;
    return Date.now() >= tokenState.tokenExpiry - AUTH_CONFIG.REFRESH_THRESHOLD;
  },

  /**
   * Clear all tokens (logout)
   */
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(AUTH_CONFIG.ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(AUTH_CONFIG.REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync("token_expiry"),
      ]);

      tokenState = {
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,
      };
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  },
};

/**
 * Create and configure axios instance
 */
const createAxiosInstance = (): AxiosInstance => {
  const config = getCurrentConfig();

  return axios.create({
    baseURL: `${config.API_BASE_URL}/${API_CONFIG.API_VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      ...DEFAULT_HEADERS,
      "X-Device-ID": Device.osInternalBuildId || "unknown",
      "X-App-Version": "1.0.0",
    },
    transformRequest: [
      (data) => {
        if (data instanceof FormData) return data;
        return JSON.stringify(data);
      },
    ],
    transformResponse: [
      (data) => {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      },
    ],
  });
};

/**
 * Transform axios error to ApiServiceError
 */
const transformError = (error: AxiosError): ApiServiceError => {
  if (error.code === "ECONNABORTED") {
    return new ApiServiceError(
      "Request timeout",
      408,
      ERROR_CODES.TIMEOUT_ERROR
    );
  }

  if (!error.response) {
    return new ApiServiceError(
      "Network error - no internet connection",
      0,
      ERROR_CODES.NETWORK_ERROR
    );
  }

  const { status, data } = error.response;
  const errorData = data as any;

  return new ApiServiceError(
    errorData?.message || error.message || "Unknown error occurred",
    status || 500,
    errorData?.code || ERROR_CODES.UNKNOWN_ERROR,
    errorData?.details
  );
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<ApiResponse<AuthResponse>>(
      `${getCurrentConfig().API_BASE_URL}/${
        API_CONFIG.API_VERSION
      }/auth/refresh`,
      { refreshToken } as RefreshTokenRequest,
      {
        headers: DEFAULT_HEADERS,
        timeout: API_CONFIG.TIMEOUT,
      }
    );

    if (response.data.success && response.data.data) {
      const { user, tokens } = response.data.data;
      await tokenManager.setTokens(
        tokens.accessToken,
        tokens.refreshToken,
        tokens.expiresIn
      );
      return response.data.data;
    } else {
      throw new ApiServiceError(
        response.data.message || "Token refresh failed",
        response.data.statusCode || 500,
        ERROR_CODES.UNAUTHORIZED
      );
    }
  } catch (error) {
    if (error instanceof ApiServiceError) {
      throw error;
    }
    throw new ApiServiceError(
      "Failed to refresh access token",
      500,
      ERROR_CODES.NETWORK_ERROR
    );
  }
};

/**
 * Handle logout when authentication fails
 */
const handleLogout = (): void => {
  console.log("Authentication failed - user should be logged out");
  // This will be implemented when we create the auth store
};

/**
 * Setup request and response interceptors
 */
const setupInterceptors = (axiosInstance: AxiosInstance): void => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = tokenManager.getAccessToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers["X-Request-Timestamp"] = Date.now().toString();

      if (__DEV__) {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            data: config.data,
            params: config.params,
            headers: config.headers,
          }
        );
      }

      return config;
    },
    (error: AxiosError) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (__DEV__) {
        console.log(
          `✅ API Response: ${response.config.method?.toUpperCase()} ${
            response.config.url
          }`,
          {
            status: response.status,
            data: response.data,
          }
        );
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      if (__DEV__) {
        console.error(
          `❌ API Error: ${error.config?.method?.toUpperCase()} ${
            error.config?.url
          }`,
          {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          }
        );
      }

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (apiServiceState.isRefreshing) {
          return new Promise((resolve, reject) => {
            apiServiceState.failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        apiServiceState.isRefreshing = true;

        try {
          const refreshToken = tokenManager.getRefreshToken();
          if (!refreshToken) {
            throw new ApiServiceError(
              "No refresh token available",
              401,
              ERROR_CODES.UNAUTHORIZED
            );
          }

          await refreshAccessToken(refreshToken);

          apiServiceState.failedQueue.forEach(({ resolve }) => {
            resolve(undefined);
          });
          apiServiceState.failedQueue = [];

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          await tokenManager.clearTokens();
          apiServiceState.failedQueue.forEach(({ reject }) => {
            reject(refreshError);
          });
          apiServiceState.failedQueue = [];

          handleLogout();
          return Promise.reject(refreshError);
        } finally {
          apiServiceState.isRefreshing = false;
        }
      }

      const apiError = transformError(error);
      return Promise.reject(apiError);
    }
  );
};

/**
 * Make HTTP request with retry logic
 */
const makeRequest = async <T = any>(
  axiosInstance: AxiosInstance,
  config: AxiosRequestConfig,
  retryConfig?: Partial<RetryConfig>
): Promise<T> => {
  const defaultRetryConfig: RetryConfig = {
    retries: API_CONFIG.MAX_RETRIES,
    retryDelay: API_CONFIG.RETRY_DELAY,
    retryCondition: (error: AxiosError) => {
      return (
        !error.response ||
        (error.response.status >= 500 && error.response.status < 600) ||
        error.response.status === 429
      );
    },
  };

  const finalRetryConfig = { ...defaultRetryConfig, ...retryConfig };
  let lastError: AxiosError;

  for (let attempt = 0; attempt <= finalRetryConfig.retries; attempt++) {
    try {
      const response = await axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      lastError = error as AxiosError;

      if (
        attempt === finalRetryConfig.retries ||
        !finalRetryConfig.retryCondition(lastError)
      ) {
        break;
      }

      const delay = finalRetryConfig.retryDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw transformError(lastError!);
};

/**
 * Create API service with configured axios instance
 */
const createApiService = () => {
  const axiosInstance = createAxiosInstance();
  setupInterceptors(axiosInstance);

  return {
    /**
     * GET request
     */
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
      return makeRequest<T>(axiosInstance, { ...config, method: "GET", url });
    },

    /**
     * POST request
     */
    async post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T> {
      return makeRequest<T>(axiosInstance, {
        ...config,
        method: "POST",
        url,
        data,
      });
    },

    /**
     * PUT request
     */
    async put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T> {
      return makeRequest<T>(axiosInstance, {
        ...config,
        method: "PUT",
        url,
        data,
      });
    },

    /**
     * PATCH request
     */
    async patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T> {
      return makeRequest<T>(axiosInstance, {
        ...config,
        method: "PATCH",
        url,
        data,
      });
    },

    /**
     * DELETE request
     */
    async delete<T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<T> {
      return makeRequest<T>(axiosInstance, {
        ...config,
        method: "DELETE",
        url,
      });
    },

    /**
     * Upload file with progress tracking
     */
    async uploadFile<T = any>(
      url: string,
      file: any,
      onProgress?: (progress: number) => void,
      config?: AxiosRequestConfig
    ): Promise<T> {
      const formData = new FormData();
      formData.append("file", file);

      return makeRequest<T>(axiosInstance, {
        ...config,
        method: "POST",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
    },

    /**
     * Get the underlying axios instance (for advanced use cases)
     */
    getAxiosInstance(): AxiosInstance {
      return axiosInstance;
    },
  };
};

// Create and export the API service instance
export const apiService = createApiService();

// Export types for external use
export type { RetryConfig };
