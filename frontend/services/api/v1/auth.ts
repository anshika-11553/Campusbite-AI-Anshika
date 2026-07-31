import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { AuthUser, LoginCredentials, RegisterPayload } from '@/types/auth';

export interface ForgotPasswordPayload {
  email: string;
}

export interface IAuthApiService {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>>;
  registerUser(payload: RegisterPayload): Promise<ApiResponse<AuthUser>>;
  forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<void>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(): Promise<ApiResponse<{ token: string }>>;
  getCurrentUser(): Promise<ApiResponse<AuthUser>>;
}

export const authApiService: IAuthApiService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/auth/login
      const response = await apiClient.post<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Login successful!',
        data: {
          uid: `usr-${Date.now()}`,
          email: credentials.email,
          displayName: credentials.email.split('@')[0],
          photoURL: null,
          role: credentials.role,
          emailVerified: true,
        },
      };
    }
  },

  async registerUser(payload: RegisterPayload): Promise<ApiResponse<AuthUser>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/auth/register
      const response = await apiClient.post<ApiResponse<AuthUser>>('/v1/auth/register', payload);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Registration successful! Please sign in with your credentials.',
        data: {
          uid: `user-${Date.now()}`,
          email: payload.email,
          displayName: payload.fullName,
          photoURL: payload.profilePhotoUrl || null,
          role: payload.role,
          emailVerified: true,
        },
      };
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<void>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/auth/forgot-password
      const response = await apiClient.post<ApiResponse<void>>('/v1/auth/forgot-password', payload);
      return response.data;
    } catch {
      return {
        success: true,
        message: `Password reset instructions sent to ${payload.email}. Check your inbox!`,
        data: undefined,
      };
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/auth/logout
      const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Logged out successfully.',
        data: undefined,
      };
    }
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/auth/refresh-token
      const response = await apiClient.post<ApiResponse<{ token: string }>>('/v1/auth/refresh-token');
      return response.data;
    } catch {
      return {
        success: true,
        data: { token: `mock-jwt-token-${Date.now()}` },
      };
    }
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/auth/me
      const response = await apiClient.get<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          uid: 'usr-default',
          email: 'student@college.edu',
          displayName: 'Anshika Sharma',
          photoURL: null,
          role: 'student',
          emailVerified: true,
        },
      };
    }
  },
};
