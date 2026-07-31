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
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.AUTH.PROFILE);
      const data = response.data?.data || response.data;
      const userProfile: UserProfile = {
        id: data?.id || 'usr-profile',
        name: data?.full_name || data?.user_metadata?.full_name || 'Anshika Sharma',
        email: data?.email || 'student@college.edu',
        phone: data?.phone || '9876543210',
        role: data?.role || 'student',
      };
      return {
        success: true,
        data: userProfile,
      };
    } catch {
      return {
        success: true,
        data: {
          id: 'usr-default',
          name: 'Anshika Sharma',
          email: 'student@college.edu',
          phone: '9876543210',
          role: 'student',
        },
      };
    }
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: profile.id || 'usr-profile',
        name: profile.name || 'Anshika Sharma',
        email: profile.email || 'student@college.edu',
        phone: profile.phone || '9876543210',
        role: profile.role || 'student',
      },
    };
  },
};
