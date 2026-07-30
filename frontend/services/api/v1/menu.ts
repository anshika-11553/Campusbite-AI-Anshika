import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { MenuItem, MenuCategory } from '@/types/menu';

export interface IMenuApiService {
  getMenuItems(): Promise<ApiResponse<MenuItem[]>>;
  getCategories(): Promise<ApiResponse<MenuCategory[]>>;
}

export const menuApiService: IMenuApiService = {
  async getMenuItems(): Promise<ApiResponse<MenuItem[]>> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(API_ENDPOINTS.MENU.ITEMS);
    return response.data;
  },

  async getCategories(): Promise<ApiResponse<MenuCategory[]>> {
    const response = await apiClient.get<ApiResponse<MenuCategory[]>>(API_ENDPOINTS.MENU.CATEGORIES);
    return response.data;
  },
};
