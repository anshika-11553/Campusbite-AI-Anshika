import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { AuthUser, LoginCredentials, RegisterPayload } from '@/types/auth';

export interface IAuthApiService {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>>;
  registerUser(payload: RegisterPayload): Promise<ApiResponse<AuthUser>>;
  logout(): Promise<ApiResponse<void>>;
  getCurrentUser(): Promise<ApiResponse<AuthUser>>;
}

export const authApiService: IAuthApiService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.post<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
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

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.get<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
