import { MenuItem } from './menu';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  priceInINR: number;
  customizations?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  studentId: string;
  vendorId: string;
  items: OrderItem[];
  totalAmountInINR: number;
  status: OrderStatus;
  estimatedPickupTime: string;
  qrCodeUrl?: string;
  createdAt: string;
}
