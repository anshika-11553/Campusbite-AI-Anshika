export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceInINR: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  isVegetarian: boolean;
  rating?: number;
  isTrending?: boolean;
  isSpecial?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface StudentOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  priceInINR: number;
  customization?: string;
}

export interface StudentOrder {
  id: string;
  orderNumber: string;
  studentId: string;
  vendorName: string;
  items: StudentOrderItem[];
  totalAmountInINR: number;
  status: OrderStatus;
  pickupSlot: string;
  paymentMethod: PaymentMethod;
  qrCodeUrl?: string;
  estimatedPreparationTimeMinutes: number;
  createdAt: string;
  queuePosition?: number;
  rating?: number;
}

export interface QueueStatus {
  orderId: string;
  orderNumber: string;
  currentStep: number; // 1: Pending, 2: Confirmed, 3: Preparing, 4: Ready
  totalSteps: number;
  statusText: string;
  estimatedWaitMinutes: number;
  queuePosition?: number;
}

export interface PickupSlot {
  id: string;
  timeLabel: string;
  isAvailable: boolean;
}

export type PaymentMethod = 'UPI' | 'CANTEEN_CARD' | 'CASH_AT_PICKUP';

export interface Category {
  id: string;
  name: string;
  iconName?: string;
}

export interface StudentStats {
  activeOrders: number;
  ordersThisMonth: number;
  moneySavedInINR: number;
  waitTimeSavedMinutes: number;
  rewardPoints: number;
  walletBalanceInINR: number;
}

export interface CanteenNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'promo' | 'system';
  isRead: boolean;
}

export interface SpendingCategorySummary {
  categoryName: string;
  amountInINR: number;
  percentage: number;
}

export interface WeeklyActivity {
  day: string;
  ordersCount: number;
}

export interface StudentAnalytics {
  monthlySpending: SpendingCategorySummary[];
  mostOrderedCategory: string;
  favoriteVendor: string;
  weeklyActivity: WeeklyActivity[];
}
