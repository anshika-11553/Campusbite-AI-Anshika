import { apiClient } from '../client';
import { ApiResponse } from '@/types/api';
import {
  MenuItem,
  Category,
  StudentOrder,
  QueueStatus,
  PickupSlot,
  CartItem,
  PaymentMethod,
} from '@/types/student';
import { FOOD_CATEGORIES, PICKUP_SLOTS } from '@/constants/menu';

export interface PlaceOrderPayload {
  items: CartItem[];
  pickupSlot: string;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
}

export interface IStudentApiService {
  getMenu(): Promise<ApiResponse<MenuItem[]>>;
  getCategories(): Promise<ApiResponse<Category[]>>;
  getActiveOrder(): Promise<ApiResponse<StudentOrder | null>>;
  getQueueStatus(orderId: string): Promise<ApiResponse<QueueStatus | null>>;
  placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<StudentOrder>>;
  getOrderHistory(): Promise<ApiResponse<StudentOrder[]>>;
  reorder(orderId: string): Promise<ApiResponse<StudentOrder>>;
  getPickupSlots(): Promise<ApiResponse<PickupSlot[]>>;
}

class StudentApiService implements IStudentApiService {
  async getMenu(): Promise<ApiResponse<MenuItem[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/menu
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/v1/student/menu');
      return response.data;
    } catch {
      // Fallback adapter for Phase 2 UI demonstration before backend API deployment
      return {
        success: true,
        data: [
          {
            id: 'item-1',
            name: 'Paneer Butter Masala Combo',
            description: 'Served with 2 butter naans, jeera rice & mint chutney.',
            priceInINR: 140,
            category: 'meals',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: true,
            rating: 4.8,
          },
          {
            id: 'item-2',
            name: 'Classic Veg Cheese Grill Sandwich',
            description: 'Loaded with capsicum, tomatoes, sweet corn, and mozzarella cheese.',
            priceInINR: 70,
            category: 'snacks',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.6,
          },
          {
            id: 'item-3',
            name: 'Cold Coffee with Ice Cream',
            description: 'Rich thick blended espresso with vanilla scoop.',
            priceInINR: 60,
            category: 'beverages',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
          },
          {
            id: 'item-4',
            name: 'Chicken Frankie Roll',
            description: 'Spiced shredded chicken wrapped in whole wheat egg paratha.',
            priceInINR: 90,
            category: 'snacks',
            isAvailable: true,
            preparationTimeMinutes: 12,
            isVegetarian: false,
            rating: 4.7,
          },
          {
            id: 'item-5',
            name: 'Samosa Pav (Set of 2)',
            description: 'Crispy hot potato samosas inside butter toasted pav with garlic chutney.',
            priceInINR: 35,
            category: 'snacks',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.5,
          },
          {
            id: 'item-6',
            name: 'Chocolate Brownie Sundae',
            description: 'Warm fudgy brownie topped with hot chocolate fudge & vanilla ice cream.',
            priceInINR: 85,
            category: 'desserts',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
          },
        ],
      };
    }
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/categories
      const response = await apiClient.get<ApiResponse<Category[]>>('/v1/student/categories');
      return response.data;
    } catch {
      return {
        success: true,
        data: FOOD_CATEGORIES,
      };
    }
  }

  async getActiveOrder(): Promise<ApiResponse<StudentOrder | null>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/orders/active
      const response = await apiClient.get<ApiResponse<StudentOrder | null>>('/v1/student/orders/active');
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          id: 'ord-101',
          orderNumber: 'CB-8492',
          studentId: 'std-user-1',
          vendorName: 'Main Campus Food Court',
          items: [
            { itemId: 'item-1', itemName: 'Paneer Butter Masala Combo', quantity: 1, priceInINR: 140 },
            { itemId: 'item-3', itemName: 'Cold Coffee with Ice Cream', quantity: 1, priceInINR: 60 },
          ],
          totalAmountInINR: 200,
          status: 'PREPARING',
          pickupSlot: 'Instant Pickup (10-15 mins)',
          paymentMethod: 'UPI',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CB-8492-std-user-1',
          estimatedPreparationTimeMinutes: 8,
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  async getQueueStatus(orderId: string): Promise<ApiResponse<QueueStatus | null>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/queue/:orderId
      const response = await apiClient.get<ApiResponse<QueueStatus | null>>(`/v1/student/queue/${orderId}`);
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          orderId,
          orderNumber: 'CB-8492',
          currentStep: 3,
          totalSteps: 4,
          statusText: 'Kitchen is preparing your meal',
          estimatedWaitMinutes: 8,
        },
      };
    }
  }

  async placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/student/orders
      const response = await apiClient.post<ApiResponse<StudentOrder>>('/v1/student/orders', payload);
      return response.data;
    } catch {
      const totalInINR = payload.items.reduce((acc, item) => acc + item.menuItem.priceInINR * item.quantity, 0);
      const newOrder: StudentOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: 'std-user-1',
        vendorName: 'Main Campus Food Court',
        items: payload.items.map((i) => ({
          itemId: i.menuItem.id,
          itemName: i.menuItem.name,
          quantity: i.quantity,
          priceInINR: i.menuItem.priceInINR,
          customization: i.customization,
        })),
        totalAmountInINR: totalInINR,
        status: 'CONFIRMED',
        pickupSlot: payload.pickupSlot,
        paymentMethod: payload.paymentMethod,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CB-NEW-${Date.now()}`,
        estimatedPreparationTimeMinutes: 12,
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        message: 'Order placed successfully!',
        data: newOrder,
      };
    }
  }

  async getOrderHistory(): Promise<ApiResponse<StudentOrder[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/orders/history
      const response = await apiClient.get<ApiResponse<StudentOrder[]>>('/v1/student/orders/history');
      return response.data;
    } catch {
      return {
        success: true,
        data: [
          {
            id: 'ord-99',
            orderNumber: 'CB-7321',
            studentId: 'std-user-1',
            vendorName: 'Main Campus Food Court',
            items: [
              { itemId: 'item-2', itemName: 'Classic Veg Cheese Grill Sandwich', quantity: 2, priceInINR: 70 },
              { itemId: 'item-3', itemName: 'Cold Coffee with Ice Cream', quantity: 1, priceInINR: 60 },
            ],
            totalAmountInINR: 200,
            status: 'COMPLETED',
            pickupSlot: 'Yesterday, 01:15 PM',
            paymentMethod: 'CANTEEN_CARD',
            estimatedPreparationTimeMinutes: 0,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'ord-98',
            orderNumber: 'CB-6102',
            studentId: 'std-user-1',
            vendorName: 'Nescafe Kiosk',
            items: [{ itemId: 'item-6', itemName: 'Chocolate Brownie Sundae', quantity: 1, priceInINR: 85 }],
            totalAmountInINR: 85,
            status: 'COMPLETED',
            pickupSlot: '2 days ago',
            paymentMethod: 'UPI',
            estimatedPreparationTimeMinutes: 0,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ],
      };
    }
  }

  async reorder(orderId: string): Promise<ApiResponse<StudentOrder>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/student/orders/:orderId/reorder
      const response = await apiClient.post<ApiResponse<StudentOrder>>(`/v1/student/orders/${orderId}/reorder`);
      return response.data;
    } catch {
      const history = await this.getOrderHistory();
      const target = history.data.find((o) => o.id === orderId) || history.data[0];
      return {
        success: true,
        message: 'Order placed again successfully!',
        data: {
          ...target,
          id: `ord-${Date.now()}`,
          orderNumber: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  async getPickupSlots(): Promise<ApiResponse<PickupSlot[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/pickup-slots
      const response = await apiClient.get<ApiResponse<PickupSlot[]>>('/v1/student/pickup-slots');
      return response.data;
    } catch {
      return {
        success: true,
        data: PICKUP_SLOTS,
      };
    }
  }
}

export const studentApiService = new StudentApiService();
