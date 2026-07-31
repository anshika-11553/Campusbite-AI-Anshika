import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface INotificationsApiService {
  getNotifications(): Promise<ApiResponse<AppNotification[]>>;
}

export const notificationsApiService: INotificationsApiService = {
  async getNotifications(): Promise<ApiResponse<AppNotification[]>> {
    const response = await apiClient.get<ApiResponse<AppNotification[]>>(API_ENDPOINTS.NOTIFICATIONS.LIST);
    return response.data;
  },
};
