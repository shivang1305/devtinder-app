// Base API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  deviceId?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  avatar?: string;
  bio?: string;
  location?: Location;
  preferences: UserPreferences;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  photos: Photo[];
  interests: string[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  socialLinks: SocialLinks;
  availability: Availability;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

export interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
}

export interface Availability {
  isAvailable: boolean;
  availableFrom?: string;
  availableTo?: string;
  timezone: string;
  workSchedule: WorkSchedule[];
}

export interface WorkSchedule {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface UserPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  distance: number; // in kilometers
  gender: ("male" | "female" | "other")[];
  skills: string[];
  experienceLevel: ("beginner" | "intermediate" | "advanced" | "expert")[];
  availability: ("full-time" | "part-time" | "contract" | "freelance")[];
  remoteWork: boolean;
  relocation: boolean;
}

// Matching types
export interface ProfileCard {
  id: string;
  user: UserProfile;
  distance: number;
  compatibility: number;
  mutualSkills: string[];
  mutualInterests: string[];
}

export interface MatchRequest {
  targetUserId: string;
  action: "like" | "pass";
}

export interface Match {
  id: string;
  users: [User, User];
  matchedAt: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface MatchResponse {
  isMatch: boolean;
  match?: Match;
  message?: string;
}

// Chat types
export interface Conversation {
  id: string;
  match: Match;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file" | "location";
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type: "text" | "image" | "file" | "location";
  metadata?: Record<string, any>;
}

export interface MarkReadRequest {
  conversationId: string;
  messageIds?: string[];
}

// Settings types
export interface NotificationSettings {
  pushNotifications: {
    newMatches: boolean;
    messages: boolean;
    likes: boolean;
    profileViews: boolean;
    reminders: boolean;
  };
  emailNotifications: {
    newMatches: boolean;
    messages: boolean;
    likes: boolean;
    profileViews: boolean;
    reminders: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    showDistance: boolean;
    showAge: boolean;
  };
}

export interface AppSettings {
  theme: "light" | "dark" | "auto";
  language: string;
  notifications: NotificationSettings;
  privacy: {
    profileVisibility: "public" | "friends" | "private";
    allowMessagesFrom: "matches" | "everyone" | "none";
  };
}

// API Request/Response types for specific endpoints
export interface GetProfilesRequest {
  page?: number;
  limit?: number;
  filters?: {
    skills?: string[];
    experienceLevel?: string[];
    availability?: string[];
    distance?: number;
    ageRange?: {
      min: number;
      max: number;
    };
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: Location;
  interests?: string[];
  skills?: Skill[];
  experience?: Experience[];
  education?: Education[];
  socialLinks?: SocialLinks;
  availability?: Availability;
}

export interface UploadAvatarRequest {
  uri: string;
  type: string;
  name: string;
}

export interface UploadAvatarResponse {
  avatar: {
    id: string;
    url: string;
    thumbnailUrl: string;
  };
}

// Error response types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationErrorResponse extends ApiError {
  details: ValidationError[];
}

// WebSocket types
export interface WebSocketMessage {
  type: "message" | "match" | "like" | "profile_view" | "notification";
  data: any;
  timestamp: string;
}

export interface WebSocketConnection {
  isConnected: boolean;
  lastConnected?: string;
  reconnectAttempts: number;
}

// Utility types
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  method: ApiMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}

// Generic types for common patterns
export type Id = string;

export type Timestamp = string;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Status types
export type UserStatus = "online" | "offline" | "away" | "busy";

export type MatchStatus = "pending" | "matched" | "unmatched";

export type MessageStatus = "sent" | "delivered" | "read" | "failed";

// Enum-like types
export const GENDER_OPTIONS = ["male", "female", "other"] as const;
export type Gender = (typeof GENDER_OPTIONS)[number];

export const EXPERIENCE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const AVAILABILITY_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
] as const;
export type AvailabilityType = (typeof AVAILABILITY_TYPES)[number];

export const MESSAGE_TYPES = ["text", "image", "file", "location"] as const;
export type MessageType = (typeof MESSAGE_TYPES)[number];

export const THEME_OPTIONS = ["light", "dark", "auto"] as const;
export type Theme = (typeof THEME_OPTIONS)[number];
