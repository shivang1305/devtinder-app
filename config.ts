// API Configuration
export const API_CONFIG = {
  // Base URL for API endpoints
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.devtinder.com",

  // API version
  API_VERSION: "v1",

  // Timeout settings
  TIMEOUT: 30000, // 30 seconds

  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    BURST_LIMIT: 10,
  },
} as const;

// Environment configuration
export const ENV_CONFIG = {
  // Development environment
  DEV: {
    API_BASE_URL: "http://localhost:3000",
    LOG_LEVEL: "debug",
    ENABLE_MOCK_DATA: true,
  },

  // Staging environment
  STAGING: {
    API_BASE_URL: "https://staging-api.devtinder.com",
    LOG_LEVEL: "info",
    ENABLE_MOCK_DATA: false,
  },

  // Production environment
  PROD: {
    API_BASE_URL: "https://api.devtinder.com",
    LOG_LEVEL: "error",
    ENABLE_MOCK_DATA: false,
  },
} as const;

// Get current environment
export const getCurrentEnvironment = (): keyof typeof ENV_CONFIG => {
  if (__DEV__) return "DEV";
  // You can add logic here to detect staging vs production
  return "PROD";
};

// Get current config based on environment
export const getCurrentConfig = () => {
  const env = getCurrentEnvironment();
  return ENV_CONFIG[env];
};

// Headers configuration
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "User-Agent": "DevTinder-Mobile/1.0.0",
} as const;

// Authentication configuration
export const AUTH_CONFIG = {
  // Token storage keys
  ACCESS_TOKEN_KEY: "devtinder_access_token",
  REFRESH_TOKEN_KEY: "devtinder_refresh_token",

  // Token expiration (in milliseconds)
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Auto refresh threshold (refresh token 5 minutes before expiry)
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
} as const;

// Error codes and messages
export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // User management
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    UPLOAD_AVATAR: "/user/avatar",
    DELETE_ACCOUNT: "/user/account",
  },

  // Matching
  MATCHING: {
    GET_PROFILES: "/matching/profiles",
    LIKE_PROFILE: "/matching/like",
    PASS_PROFILE: "/matching/pass",
    GET_MATCHES: "/matching/matches",
    UNMATCH: "/matching/unmatch",
  },

  // Chat
  CHAT: {
    GET_CONVERSATIONS: "/chat/conversations",
    GET_MESSAGES: "/chat/messages",
    SEND_MESSAGE: "/chat/messages",
    MARK_READ: "/chat/messages/read",
  },

  // Settings
  SETTINGS: {
    GET_PREFERENCES: "/settings/preferences",
    UPDATE_PREFERENCES: "/settings/preferences",
    GET_NOTIFICATIONS: "/settings/notifications",
    UPDATE_NOTIFICATIONS: "/settings/notifications",
  },
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_LOCATION_SERVICES: true,
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_DARK_MODE: true,
  ENABLE_OFFLINE_MODE: false,
} as const;
