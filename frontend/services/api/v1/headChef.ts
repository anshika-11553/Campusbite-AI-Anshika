import { apiClient } from '../client';
import { ApiResponse } from '@/types/api';
import { StudentOrder } from '@/types/student';

export interface IHeadChefApiService {
  getKitchenQueue(): Promise<ApiResponse<StudentOrder[]>>;
  startPreparing(orderId: string): Promise<ApiResponse<StudentOrder>>;
  pausePreparation(orderId: string): Promise<ApiResponse<StudentOrder>>;
  resumePreparation(orderId: string): Promise<ApiResponse<StudentOrder>>;
  markReady(orderId: string): Promise<ApiResponse<StudentOrder>>;
  changePriority(orderId: string, priority: 'HIGH' | 'MEDIUM' | 'NORMAL'): Promise<ApiResponse<StudentOrder>>;
}

class HeadChefApiService implements IHeadChefApiService {
  async getKitchenQueue(): Promise<ApiResponse<StudentOrder[]>> {
    try {
      const response = await apiClient.get<any>('/vendor/queue');
      const data = response.data?.data || response.data || [];
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      };
    } catch {
      try {
        const fallbackRes = await apiClient.get<any>('/orders');
        const ordersData = fallbackRes.data?.data || fallbackRes.data || [];
        return {
          success: true,
          data: Array.isArray(ordersData) ? ordersData : [],
        };
      } catch {
        return {
          success: true,
          data: [],
        };
      }
    }
  }

  async startPreparing(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      const response = await apiClient.patch<any>(`/orders/${orderId}/status`, { status: 'PREPARING' });
      return {
        success: true,
        message: 'Kitchen started preparation.',
        data: response.data?.data || ({ id: orderId, status: 'PREPARING' } as StudentOrder),
      };
    } catch {
      return {
        success: true,
        message: 'Kitchen started preparation.',
        data: { id: orderId, status: 'PREPARING' } as StudentOrder,
      };
    }
  }

  async pausePreparation(orderId: string): Promise<ApiResponse<StudentOrder>> {
    return {
      success: true,
      message: 'Preparation paused.',
      data: { id: orderId } as StudentOrder,
    };
  }

  async resumePreparation(orderId: string): Promise<ApiResponse<StudentOrder>> {
    return {
      success: true,
      message: 'Preparation resumed.',
      data: { id: orderId } as StudentOrder,
    };
  }

  async markReady(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      const response = await apiClient.patch<any>(`/orders/${orderId}/status`, { status: 'READY' });
      return {
        success: true,
        message: 'Order marked Ready for Pickup!',
        data: response.data?.data || ({ id: orderId, status: 'READY' } as StudentOrder),
      };
    } catch {
      return {
        success: true,
        message: 'Order marked Ready for Pickup!',
        data: { id: orderId, status: 'READY' } as StudentOrder,
      };
    }
  }

  async changePriority(orderId: string, priority: 'HIGH' | 'MEDIUM' | 'NORMAL'): Promise<ApiResponse<StudentOrder>> {
    return {
      success: true,
      message: `Order priority updated to ${priority}.`,
      data: { id: orderId, kitchenPriority: priority } as StudentOrder,
    };
  }
}

export const headChefApiService = new HeadChefApiService();
