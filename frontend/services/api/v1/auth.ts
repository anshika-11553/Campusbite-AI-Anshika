import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { AuthUser, LoginCredentials } from '@/types/auth';

export interface IAuthApiService {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>>;
  logout(): Promise<ApiResponse<void>>;
  getCurrentUser(): Promise<ApiResponse<AuthUser>>;
}

export const authApiService: IAuthApiService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.post<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
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
