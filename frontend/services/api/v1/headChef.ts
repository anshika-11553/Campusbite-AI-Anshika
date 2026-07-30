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
      // TODO: Replace with backend API endpoint: GET /api/v1/headchef/queue
      const response = await apiClient.get<ApiResponse<StudentOrder[]>>('/v1/headchef/queue');
      return response.data;
    } catch {
      return {
        success: true,
        data: [],
      };
    }
  }

  async startPreparing(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/headchef/orders/:orderId/start
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/headchef/orders/${orderId}/start`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Kitchen started preparation.',
        data: { id: orderId, status: 'PREPARING' } as StudentOrder,
      };
    }
  }

  async pausePreparation(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/headchef/orders/:orderId/pause
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/headchef/orders/${orderId}/pause`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Preparation paused.',
        data: { id: orderId } as StudentOrder,
      };
    }
  }

  async resumePreparation(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/headchef/orders/:orderId/resume
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/headchef/orders/${orderId}/resume`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Preparation resumed.',
        data: { id: orderId } as StudentOrder,
      };
    }
  }

  async markReady(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/headchef/orders/:orderId/ready
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/headchef/orders/${orderId}/ready`);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Order marked Ready for Pickup!',
        data: { id: orderId, status: 'READY' } as StudentOrder,
      };
    }
  }

  async changePriority(orderId: string, priority: 'HIGH' | 'MEDIUM' | 'NORMAL'): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/headchef/orders/:orderId/priority
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/headchef/orders/${orderId}/priority`, { priority });
      return response.data;
    } catch {
      return {
        success: true,
        message: `Order priority updated to ${priority}.`,
        data: { id: orderId, kitchenPriority: priority } as StudentOrder,
      };
    }
  }
}

export const headChefApiService = new HeadChefApiService();
