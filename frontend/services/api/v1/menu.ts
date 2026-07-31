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
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.MENU.LIST);
      const data = response.data?.data || response.data || [];
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
      };
    } catch {
      return {
        success: true,
        data: [],
      };
    }
  },

  async getCategories(): Promise<ApiResponse<MenuCategory[]>> {
    try {
      const menuRes = await this.getMenuItems();
      const items = menuRes.data || [];
      const categoryNames = Array.from(new Set(items.map((i: any) => i.category || 'General')));
      const categories: MenuCategory[] = categoryNames.map((name, idx) => ({
        id: `cat-${idx + 1}`,
        name: name,
        displayOrder: idx + 1,
      }));
      return {
        success: true,
        data: categories,
      };
    } catch {
      return {
        success: true,
        data: [],
      };
    }
  },
};
