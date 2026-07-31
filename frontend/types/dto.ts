import { UserRole } from './auth';
import { OrderStatus } from './student';

/**
 * Swagger / OpenAPI 3.0 Compatible Data Transfer Objects (DTOs)
 */

export interface ApiResponseDto<T = void> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
  statusCode?: number;
}

export interface AuthLoginDto {
  email: string;
  role: UserRole;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthRegisterDto {
  fullName: string;
  email: string;
  mobile: string;
  studentOrStaffId: string;
  department: string;
  role: UserRole;
  password?: string;
  profilePhotoUrl?: string;
}

export interface MenuItemDto {
  id: string;
  name: string;
  description: string;
  priceInINR: number;
  category: string;
  imageUrl: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  calories?: number;
  preparationTimeMinutes: number;
  rating?: number;
  isPopular?: boolean;
  isNew?: boolean;
  isSpecial?: boolean;
  isHealthy?: boolean;
  isQuick?: boolean;
  isFavorite?: boolean;
}

export interface CreateOrderDto {
  studentId: string;
  studentName: string;
  vendorName: string;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    priceInINR: number;
  }>;
  totalAmountInINR: number;
  pickupSlot: string;
  paymentMethod: string;
  specialInstructions?: string;
}

export interface UpdateOrderStatusDto {
  orderId: string;
  status: OrderStatus;
  pickupCounter?: string;
  acceptedBy?: string;
  preparedBy?: string;
  isPaused?: boolean;
  kitchenPriority?: 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface VendorAnalyticsDto {
  totalRevenueInINR: number;
  totalOrdersCount: number;
  completedOrdersCount: number;
  avgPreparationTimeMinutes: number;
  customerRating: number;
  topSellingItems: Array<{
    name: string;
    count: number;
    revenueInINR: number;
  }>;
}

export interface StudentStatsDto {
  totalOrdersCount: number;
  activeOrdersCount: number;
  completedOrdersCount: number;
  favouriteItemsCount: number;
  totalSpentInINR: number;
  rewardPoints: number;
  walletBalanceInINR: number;
  savedTimeInMinutes: number;
}
