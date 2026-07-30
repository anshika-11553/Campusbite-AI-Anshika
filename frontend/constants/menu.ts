import { Category, PickupSlot, PaymentMethod, OrderStatus } from '@/types/student';

export const FOOD_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items' },
  { id: 'snacks', name: 'Quick Snacks' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'meals', name: 'Full Meals' },
  { id: 'desserts', name: 'Desserts' },
];

export const PICKUP_SLOTS: PickupSlot[] = [
  { id: 'slot-1', timeLabel: 'Instant Pickup (10-15 mins)', isAvailable: true },
  { id: 'slot-2', timeLabel: '12:30 PM - 12:45 PM', isAvailable: true },
  { id: 'slot-3', timeLabel: '01:00 PM - 01:15 PM', isAvailable: true },
  { id: 'slot-4', timeLabel: '01:30 PM - 01:45 PM', isAvailable: true },
  { id: 'slot-5', timeLabel: '04:30 PM - 04:45 PM (Evening)', isAvailable: true },
];

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string }[] = [
  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', description: 'Instant digital checkout' },
  { id: 'CANTEEN_CARD', label: 'Student Canteen Card', description: 'Deduct from student wallet balance' },
  { id: 'CASH_AT_PICKUP', label: 'Cash at Counter Pickup', description: 'Pay cash when collecting order' },
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; variant: 'amber' | 'emerald' | 'slate' | 'red' }> = {
  PENDING: { label: 'Order Placed', variant: 'amber' },
  ACCEPTED: { label: 'Accepted by Vendor', variant: 'amber' },
  SENT_TO_KITCHEN: { label: 'Sent to Kitchen', variant: 'amber' },
  PREPARING: { label: 'Kitchen Preparing', variant: 'amber' },
  READY: { label: 'Ready for Pickup', variant: 'emerald' },
  COLLECTED: { label: 'Order Collected', variant: 'slate' },
  CANCELLED: { label: 'Cancelled', variant: 'red' },
};
