'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StudentOrder, OrderStatus } from '@/types/student';
import { tokenGeneratorService } from '@/services/workflow/tokenGenerator';
import { queueManagerService } from '@/services/workflow/queueManager';
import { eventBus, WORKFLOW_EVENTS } from '@/services/realtime/eventBus';
import { useToast } from '@/hooks/useToast';

interface OrderWorkflowContextType {
  orders: StudentOrder[];
  placeOrder: (newOrder: Omit<StudentOrder, 'id' | 'orderNumber' | 'tokenNumber' | 'createdAt' | 'queuePosition' | 'pickupCounter' | 'status'>) => StudentOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, extra?: Partial<StudentOrder>) => void;
  cancelOrder: (orderId: string) => void;
  markOrderDelivered: (orderId: string, inputToken: string) => { success: boolean; message: string };
  getOrdersByStatus: (statuses: OrderStatus[]) => StudentOrder[];
  getActiveStudentOrder: () => StudentOrder | null;
}

const OrderWorkflowContext = createContext<OrderWorkflowContextType | undefined>(undefined);

const INITIAL_DEMO_ORDERS: StudentOrder[] = [
  {
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
    createdAt: '2026-07-30T12:00:00.000Z',
    queuePosition: 2,
    pickupCounter: 'Counter A',
    kitchenPriority: 'HIGH',
    acceptedBy: 'Chef Ramesh',
    preparedBy: 'Head Chef Master',
  },
  {
    id: 'ord-102',
    orderNumber: 'CB-9104',
    tokenNumber: '10',
    studentId: 'std-user-2',
    studentName: 'Rahul Verma',
    vendorName: 'Main Campus Food Court',
    items: [
      { itemId: 'item-2', itemName: 'Classic Veg Cheese Grill Sandwich', quantity: 1, priceInINR: 70 },
    ],
    totalAmountInINR: 70,
    status: 'PENDING',
    pickupSlot: 'In 15 mins',
    paymentMethod: 'CANTEEN_CARD',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TOKEN-10-CB-9104',
    estimatedPreparationTimeMinutes: 10,
    createdAt: '2026-07-30T12:05:00.000Z',
    queuePosition: 3,
    pickupCounter: 'Counter B',
    kitchenPriority: 'NORMAL',
  },
];

export const OrderWorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<StudentOrder[]>(INITIAL_DEMO_ORDERS);

  // Track toasted event keys to guarantee single notification delivery
  const toastedKeysRef = React.useRef<Set<string>>(new Set());

  const notifyOnce = useCallback((key: string, msg: string, type: 'success' | 'info' | 'warning' | 'error') => {
    if (!toastedKeysRef.current.has(key)) {
      toastedKeysRef.current.add(key);
      showToast(msg, type);
    }
  }, [showToast]);

  // Handle EventBus Subscriptions for Cross-Dashboard Notification Alerts
  useEffect(() => {
    const unsubAccepted = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.ORDER_ACCEPTED, ({ order }) => {
      notifyOnce(`ACCEPTED-${order.id}`, `Token #${order.tokenNumber} Accepted by Vendor!`, 'success');
    });

    const unsubForwarded = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.FORWARDED_TO_KITCHEN, ({ order }) => {
      notifyOnce(`FORWARDED-${order.id}`, `Token #${order.tokenNumber} Forwarded to Kitchen Queue.`, 'info');
    });

    const unsubPreparing = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.PREPARATION_STARTED, ({ order }) => {
      notifyOnce(`PREPARING-${order.id}`, `Head Chef started preparing Token #${order.tokenNumber}! 🔥`, 'info');
    });

    const unsubReady = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.ORDER_READY, ({ order }) => {
      notifyOnce(`READY-${order.id}`, `🎉 Token #${order.tokenNumber} is READY for Pickup at ${order.pickupCounter || 'Counter A'}!`, 'success');
    });

    const unsubCollected = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.ORDER_COLLECTED, ({ order }) => {
      notifyOnce(`COLLECTED-${order.id}`, `Token #${order.tokenNumber} collected. Thank you!`, 'success');
    });

    return () => {
      unsubAccepted();
      unsubForwarded();
      unsubPreparing();
      unsubReady();
      unsubCollected();
    };
  }, [notifyOnce]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, extra?: Partial<StudentOrder>) => {
    let targetOrder: StudentOrder | undefined;

    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          const nextOrder: StudentOrder = { ...order, ...extra, status };

          // Recalculate queue position
          nextOrder.queuePosition = queueManagerService.calculateQueuePosition(prev, orderId);

          // Recycle Token if Completed or Cancelled
          if (status === 'COLLECTED' || status === 'CANCELLED') {
            tokenGeneratorService.releaseToken(order.tokenNumber);
          }

          targetOrder = nextOrder;
          return nextOrder;
        }
        return order;
      });

      return updated;
    });

    if (targetOrder) {
      const order = targetOrder;
      if (status === 'ACCEPTED') eventBus.publish(WORKFLOW_EVENTS.ORDER_ACCEPTED, { order });
      if (status === 'SENT_TO_KITCHEN') eventBus.publish(WORKFLOW_EVENTS.FORWARDED_TO_KITCHEN, { order });
      if (status === 'PREPARING') eventBus.publish(WORKFLOW_EVENTS.PREPARATION_STARTED, { order });
      if (status === 'READY') eventBus.publish(WORKFLOW_EVENTS.ORDER_READY, { order });
      if (status === 'COLLECTED') eventBus.publish(WORKFLOW_EVENTS.ORDER_COLLECTED, { order });
    }
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (target) {
        tokenGeneratorService.releaseToken(target.tokenNumber);
        showToast(`Order #${target.orderNumber} (Token #${target.tokenNumber}) Cancelled.`, 'info');
      }
      return prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    });
  }, [showToast]);

  const placeOrder = useCallback(
    (newOrderData: Omit<StudentOrder, 'id' | 'orderNumber' | 'tokenNumber' | 'createdAt' | 'queuePosition' | 'pickupCounter' | 'status'>) => {
      const tokenNumber = tokenGeneratorService.generateNextToken();
      const orderId = `ord-${Date.now()}`;
      const orderNumber = `CB-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const receiptNumber = `REC-CB-${Math.floor(100000 + Math.random() * 900000)}`;
      const gstAmountInINR = Math.round(newOrderData.totalAmountInINR * 0.05);

      const createdOrder: StudentOrder = {
        ...newOrderData,
        id: orderId,
        orderNumber,
        tokenNumber,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        paymentStatus: 'PAID',
        paymentId,
        receiptNumber,
        gstAmountInINR,
        isDelivered: false,
        queuePosition: orders.length + 1,
        pickupCounter: 'Counter A',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TOKEN-${tokenNumber}-${orderNumber}`,
      };

      setOrders((prev) => [createdOrder, ...prev]);

      eventBus.publish(WORKFLOW_EVENTS.ORDER_PLACED, { order: createdOrder });
      showToast(`Payment Successful! Token #${tokenNumber} Generated`, 'success');

      return createdOrder;
    },
    [orders.length, showToast]
  );

  const markOrderDelivered = useCallback(
    (orderId: string, inputToken: string) => {
      let result = { success: false, message: 'Order not found.' };

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            if (o.isDelivered || o.status === 'COLLECTED') {
              result = { success: false, message: `Token #${o.tokenNumber} has ALREADY been delivered! Prevented duplicate collection.` };
              return o;
            }
            if (o.tokenNumber !== inputToken.trim()) {
              result = { success: false, message: `Token mismatch! Expected #${o.tokenNumber}, received #${inputToken}.` };
              return o;
            }

            tokenGeneratorService.releaseToken(o.tokenNumber);
            result = { success: true, message: `Token #${o.tokenNumber} verified & delivered!` };
            return { ...o, status: 'COLLECTED', isDelivered: true };
          }
          return o;
        })
      );

      if (result.success) {
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }

      return result;
    },
    [showToast]
  );

  const getOrdersByStatus = useCallback(
    (statuses: OrderStatus[]) => {
      return orders.filter((o) => statuses.includes(o.status));
    },
    [orders]
  );

  const getActiveStudentOrder = useCallback(() => {
    return orders.find((o) => o.status !== 'COLLECTED' && o.status !== 'CANCELLED') || null;
  }, [orders]);

  return (
    <OrderWorkflowContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        markOrderDelivered,
        getOrdersByStatus,
        getActiveStudentOrder,
      }}
    >
      {children}
    </OrderWorkflowContext.Provider>
  );
};

export const useOrderWorkflow = () => {
  const context = useContext(OrderWorkflowContext);
  if (!context) {
    throw new Error('useOrderWorkflow must be used within an OrderWorkflowProvider');
  }
  return context;
};
