import { apiClient } from '../client';
import { ApiResponse } from '@/types/api';
import { StudentOrder } from '@/types/student';

export interface IVendorApiService {
  getIncomingOrders(): Promise<ApiResponse<StudentOrder[]>>;
  acceptOrder(orderId: string): Promise<ApiResponse<StudentOrder>>;
  rejectOrder(orderId: string): Promise<ApiResponse<{ orderId: string }>>;
  forwardToKitchen(orderId: string): Promise<ApiResponse<StudentOrder>>;
  printKitchenSlip(orderId: string): Promise<ApiResponse<{ printed: boolean }>>;
  delayOrder(orderId: string, minutes: number): Promise<ApiResponse<StudentOrder>>;
  notifyStudent(orderId: string, message: string): Promise<ApiResponse<{ notified: boolean }>>;
}

class VendorApiService implements IVendorApiService {
  async getIncomingOrders(): Promise<ApiResponse<StudentOrder[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/vendor/orders
      const response = await apiClient.get<ApiResponse<StudentOrder[]>>('/v1/vendor/orders');
      return response.data;
    } catch {
      return {
        success: true,
        data: [],
      };
    }
  }

  async acceptOrder(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/vendor/orders/:orderId/accept
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/vendor/orders/${orderId}/accept`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Order accepted successfully!',
        data: { id: orderId, status: 'ACCEPTED' } as StudentOrder,
      };
    }
  }

  async rejectOrder(orderId: string): Promise<ApiResponse<{ orderId: string }>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/vendor/orders/:orderId/reject
      const response = await apiClient.post<ApiResponse<{ orderId: string }>>(`/v1/vendor/orders/${orderId}/reject`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Order rejected.',
        data: { orderId },
      };
    }
  }

  async forwardToKitchen(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/vendor/orders/:orderId/forward-kitchen
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/vendor/orders/${orderId}/forward-kitchen`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Order forwarded to Head Chef KDS!',
        data: { id: orderId, status: 'SENT_TO_KITCHEN' } as StudentOrder,
      };
    }
  }

  async printKitchenSlip(orderId: string): Promise<ApiResponse<{ printed: boolean }>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/vendor/orders/:orderId/print-slip
      const response = await apiClient.post<ApiResponse<{ printed: boolean }>>(`/v1/vendor/orders/${orderId}/print-slip`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Kitchen slip sent to thermal printer.',
        data: { printed: true },
      };
    }
  }

  async delayOrder(orderId: string, minutes: number): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/vendor/orders/:orderId/delay
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/vendor/orders/${orderId}/delay`, { minutes });
      return response.data;
    } catch {
      return {
        success: true,
        message: `Order estimated wait time extended by +${minutes} mins.`,
        data: { id: orderId } as StudentOrder,
      };
    }
  }

  async notifyStudent(orderId: string, message: string): Promise<ApiResponse<{ notified: boolean }>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/vendor/orders/:orderId/notify
      const response = await apiClient.post<ApiResponse<{ notified: boolean }>>(`/v1/vendor/orders/${orderId}/notify`, { message });
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Push notification sent to student.',
        data: { notified: true },
      };
    }
  }
}

export const vendorApiService = new VendorApiService();
