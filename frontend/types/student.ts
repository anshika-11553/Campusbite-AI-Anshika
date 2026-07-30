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
  calories?: string;
  protein?: string;
  isTrending?: boolean;
  isSpecial?: boolean;
  isFavorite?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isHealthy?: boolean;
  isQuick?: boolean;
  tags?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: string;
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'SENT_TO_KITCHEN' | 'PREPARING' | 'READY' | 'COLLECTED' | 'CANCELLED';

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
  tokenNumber: string; // Padded two-digit token (e.g. "07", "27")
  studentId: string;
  studentName?: string;
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
  pickupCounter?: string;
  kitchenPriority?: 'HIGH' | 'MEDIUM' | 'NORMAL';
  specialInstructions?: string;
  acceptedBy?: string;
  preparedBy?: string;
  isPaused?: boolean;
  rating?: number;
}

export interface QueueStatus {
  orderId: string;
  orderNumber: string;
  tokenNumber?: string;
  currentStep: number;
  totalSteps: number;
  statusText: string;
  estimatedWaitMinutes: number;
  queuePosition?: number;
  pickupCounter?: string;
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
  totalOrders: number;
  ordersThisMonth: number;
  moneySavedInINR: number;
  waitTimeSavedMinutes: number;
  rewardPoints: number;
  walletBalanceInINR: number;
  favoriteCategory: string;
  favoriteVendor: string;
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
