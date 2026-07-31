import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { Order, OrderStatus } from '@/types/order';

export interface IOrdersApiService {
  getOrders(): Promise<ApiResponse<Order[]>>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<ApiResponse<Order>>;
}

export const ordersApiService: IOrdersApiService = {
  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await apiClient.get<ApiResponse<Order[]>>(API_ENDPOINTS.ORDERS.LIST);
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    const response = await apiClient.patch<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.STATUS(orderId),
      { status }
    );
    return response.data;
  },
};
