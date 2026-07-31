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
    return {
      success: true,
      data: [
        {
          id: 'notif-1',
          title: 'Order Status Update',
          message: 'Your order has been accepted by the kitchen.',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  },
};
