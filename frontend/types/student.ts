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
}

export interface QueueStatus {
  orderId: string;
  orderNumber: string;
  currentStep: number; // 1: Pending, 2: Confirmed, 3: Preparing, 4: Ready
  totalSteps: number;
  statusText: string;
  estimatedWaitMinutes: number;
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
