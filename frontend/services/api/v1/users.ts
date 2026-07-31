import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { UserProfile } from '@/types/user';

export interface IUsersApiService {
  getUserProfile(): Promise<ApiResponse<UserProfile>>;
  updateUserProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>>;
}

export const usersApiService: IUsersApiService = {
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.put<ApiResponse<UserProfile>>(API_ENDPOINTS.USERS.PROFILE, profile);
    return response.data;
  },
};
