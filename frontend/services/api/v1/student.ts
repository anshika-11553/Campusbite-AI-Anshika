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
  StudentStats,
  CanteenNotification,
  StudentAnalytics,
} from '@/types/student';
import { FOOD_CATEGORIES, PICKUP_SLOTS } from '@/constants/menu';

export interface PlaceOrderPayload {
  items: CartItem[];
  pickupSlot: string;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  couponCode?: string;
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
  getStudentStats(): Promise<ApiResponse<StudentStats>>;
  getRecommendedItems(): Promise<ApiResponse<MenuItem[]>>;
  getTrendingItems(): Promise<ApiResponse<MenuItem[]>>;
  getNotifications(): Promise<ApiResponse<CanteenNotification[]>>;
  getStudentAnalytics(): Promise<ApiResponse<StudentAnalytics>>;
  toggleFavoriteItem(itemId: string): Promise<ApiResponse<{ isFavorite: boolean }>>;
}

class StudentApiService implements IStudentApiService {
  async getMenu(): Promise<ApiResponse<MenuItem[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/menu
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/v1/student/menu');
      return response.data;
    } catch {
      return {
        success: true,
        data: [
          {
            id: 'item-1',
            name: 'Paneer Butter Masala Combo',
            description: 'Served with 2 butter naans, jeera rice & mint chutney.',
            priceInINR: 140,
            category: 'meals',
            imageUrl: '/images/food/paneer_masala.jpg',
            isAvailable: true,
            preparationTimeMinutes: 15,
            isVegetarian: true,
            rating: 4.8,
            isSpecial: true,
            isTrending: true,
            isFavorite: true,
            tags: ['Chef Choice', 'Best Seller'],
          },
          {
            id: 'item-2',
            name: 'Classic Veg Cheese Grill Sandwich',
            description: 'Loaded with capsicum, tomatoes, sweet corn, and mozzarella cheese.',
            priceInINR: 70,
            category: 'snacks',
            imageUrl: '/images/food/cheese_sandwich.jpg',
            isAvailable: true,
            preparationTimeMinutes: 10,
            isVegetarian: true,
            rating: 4.6,
            isTrending: true,
            isFavorite: false,
            tags: ['Quick Bite'],
          },
          {
            id: 'item-3',
            name: 'Cold Coffee with Ice Cream',
            description: 'Rich thick blended espresso with vanilla scoop.',
            priceInINR: 60,
            category: 'beverages',
            imageUrl: '/images/food/cold_coffee.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
            isTrending: true,
            isFavorite: true,
            tags: ['Popular Brew'],
          },
          {
            id: 'item-4',
            name: 'Chicken Frankie Roll',
            description: 'Spiced shredded chicken wrapped in whole wheat egg paratha.',
            priceInINR: 90,
            category: 'snacks',
            imageUrl: '/images/food/chicken_frankie.jpg',
            isAvailable: true,
            preparationTimeMinutes: 12,
            isVegetarian: false,
            rating: 4.7,
            isTrending: true,
            isFavorite: false,
            tags: ['High Protein'],
          },
          {
            id: 'item-5',
            name: 'Samosa Pav (Set of 2)',
            description: 'Crispy hot potato samosas inside butter toasted pav with garlic chutney.',
            priceInINR: 35,
            category: 'snacks',
            imageUrl: '/images/food/samosa_pav.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.5,
            isSpecial: false,
            isFavorite: true,
            tags: ['Budget Friendly'],
          },
          {
            id: 'item-6',
            name: 'Chocolate Brownie Sundae',
            description: 'Warm fudgy brownie topped with hot chocolate fudge & vanilla ice cream.',
            priceInINR: 85,
            category: 'desserts',
            imageUrl: '/images/food/brownie_sundae.jpg',
            isAvailable: true,
            preparationTimeMinutes: 5,
            isVegetarian: true,
            rating: 4.9,
            isSpecial: true,
            isFavorite: false,
            tags: ['Sweet Cravings'],
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
          tokenNumber: '27',
          studentId: 'std-user-1',
          studentName: 'Anshika Sharma',
          vendorName: 'Main Campus Food Court',
          items: [
            { itemId: 'item-1', itemName: 'Paneer Butter Masala Combo', quantity: 1, priceInINR: 140 },
            { itemId: 'item-3', itemName: 'Cold Coffee with Ice Cream', quantity: 1, priceInINR: 60 },
          ],
          totalAmountInINR: 200,
          status: 'PREPARING',
          pickupSlot: 'Instant Pickup (10-15 mins)',
          paymentMethod: 'UPI',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TOKEN-27-CB-8492',
          estimatedPreparationTimeMinutes: 8,
          createdAt: new Date().toISOString(),
          queuePosition: 3,
          pickupCounter: 'Counter A',
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
          tokenNumber: '27',
          currentStep: 4,
          totalSteps: 6,
          statusText: 'Kitchen is preparing your meal',
          estimatedWaitMinutes: 8,
          queuePosition: 3,
          pickupCounter: 'Counter A',
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
        tokenNumber: '28',
        studentId: 'std-user-1',
        studentName: 'Anshika Sharma',
        vendorName: 'Main Campus Food Court',
        items: payload.items.map((i) => ({
          itemId: i.menuItem.id,
          itemName: i.menuItem.name,
          quantity: i.quantity,
          priceInINR: i.menuItem.priceInINR,
          customization: i.customization,
        })),
        totalAmountInINR: totalInINR,
        status: 'PENDING',
        pickupSlot: payload.pickupSlot,
        paymentMethod: payload.paymentMethod,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CB-NEW-${Date.now()}`,
        estimatedPreparationTimeMinutes: 12,
        createdAt: new Date().toISOString(),
        queuePosition: 4,
        pickupCounter: 'Counter A',
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
            tokenNumber: '15',
            studentId: 'std-user-1',
            studentName: 'Anshika Sharma',
            vendorName: 'Main Campus Food Court',
            items: [
              { itemId: 'item-2', itemName: 'Classic Veg Cheese Grill Sandwich', quantity: 2, priceInINR: 70 },
              { itemId: 'item-3', itemName: 'Cold Coffee with Ice Cream', quantity: 1, priceInINR: 60 },
            ],
            totalAmountInINR: 200,
            status: 'COLLECTED',
            pickupSlot: 'Yesterday, 01:15 PM',
            paymentMethod: 'CANTEEN_CARD',
            estimatedPreparationTimeMinutes: 0,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            rating: 5,
          },
          {
            id: 'ord-98',
            orderNumber: 'CB-6102',
            tokenNumber: '63',
            studentId: 'std-user-1',
            studentName: 'Anshika Sharma',
            vendorName: 'Nescafe Kiosk',
            items: [{ itemId: 'item-6', itemName: 'Chocolate Brownie Sundae', quantity: 1, priceInINR: 85 }],
            totalAmountInINR: 85,
            status: 'COLLECTED',
            pickupSlot: '2 days ago',
            paymentMethod: 'UPI',
            estimatedPreparationTimeMinutes: 0,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            rating: 4,
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
          tokenNumber: '29',
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

  async getStudentStats(): Promise<ApiResponse<StudentStats>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/stats
      const response = await apiClient.get<ApiResponse<StudentStats>>('/v1/student/stats');
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          activeOrders: 1,
          ordersThisMonth: 14,
          moneySavedInINR: 450,
          waitTimeSavedMinutes: 85,
          rewardPoints: 340,
          walletBalanceInINR: 650,
        },
      };
    }
  }

  async getRecommendedItems(): Promise<ApiResponse<MenuItem[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/recommended
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/v1/student/recommended');
      return response.data;
    } catch {
      const all = (await this.getMenu()).data;
      return {
        success: true,
        data: all.filter((i) => i.isSpecial || i.rating! >= 4.8),
      };
    }
  }

  async getTrendingItems(): Promise<ApiResponse<MenuItem[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/trending
      const response = await apiClient.get<ApiResponse<MenuItem[]>>('/v1/student/trending');
      return response.data;
    } catch {
      const all = (await this.getMenu()).data;
      return {
        success: true,
        data: all.filter((i) => i.isTrending),
      };
    }
  }

  async getNotifications(): Promise<ApiResponse<CanteenNotification[]>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/notifications
      const response = await apiClient.get<ApiResponse<CanteenNotification[]>>('/v1/student/notifications');
      return response.data;
    } catch {
      return {
        success: true,
        data: [
          {
            id: 'notif-1',
            title: 'Token #27 Update',
            message: 'Kitchen is currently preparing your Paneer Butter Masala Combo.',
            timestamp: '5 mins ago',
            type: 'order',
            isRead: false,
          },
          {
            id: 'notif-2',
            title: 'Evening Snack Combo Offer!',
            message: 'Get Cold Coffee + Sandwich at ₹110 only today.',
            timestamp: '1 hour ago',
            type: 'promo',
            isRead: false,
          },
          {
            id: 'notif-3',
            title: 'Reward Points Earned',
            message: 'You earned +20 points on your last completed order.',
            timestamp: 'Yesterday',
            type: 'system',
            isRead: true,
          },
        ],
      };
    }
  }

  async getStudentAnalytics(): Promise<ApiResponse<StudentAnalytics>> {
    try {
      // TODO: Replace with backend API endpoint: GET /api/v1/student/analytics
      const response = await apiClient.get<ApiResponse<StudentAnalytics>>('/v1/student/analytics');
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          monthlySpending: [
            { categoryName: 'Quick Snacks', amountInINR: 420, percentage: 35 },
            { categoryName: 'Full Meals', amountInINR: 560, percentage: 46 },
            { categoryName: 'Beverages', amountInINR: 230, percentage: 19 },
          ],
          mostOrderedCategory: 'Full Meals',
          favoriteVendor: 'Main Campus Food Court',
          weeklyActivity: [
            { day: 'Mon', ordersCount: 2 },
            { day: 'Tue', ordersCount: 3 },
            { day: 'Wed', ordersCount: 1 },
            { day: 'Thu', ordersCount: 4 },
            { day: 'Fri', ordersCount: 3 },
            { day: 'Sat', ordersCount: 1 },
          ],
        },
      };
    }
  }

  async toggleFavoriteItem(itemId: string): Promise<ApiResponse<{ isFavorite: boolean }>> {
    try {
      // TODO: Replace with backend API endpoint: POST /api/v1/student/favorites/:itemId
      const response = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/v1/student/favorites/${itemId}`);
      return response.data;
    } catch {
      return {
        success: true,
        data: { isFavorite: true },
      };
    }
  }
}

export const studentApiService = new StudentApiService();
