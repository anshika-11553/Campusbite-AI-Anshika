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

  // Handle EventBus Subscriptions for Cross-Dashboard Notification Alerts
  useEffect(() => {
    const unsubAccepted = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.ORDER_ACCEPTED, ({ order }) => {
      showToast(`Token #${order.tokenNumber} Accepted by Vendor!`, 'success');
    });

    const unsubForwarded = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.FORWARDED_TO_KITCHEN, ({ order }) => {
      showToast(`Token #${order.tokenNumber} Forwarded to Kitchen Queue.`, 'info');
    });

    const unsubPreparing = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.PREPARATION_STARTED, ({ order }) => {
      showToast(`Head Chef started preparing Token #${order.tokenNumber}! 🔥`, 'info');
    });

    const unsubReady = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.ORDER_READY, ({ order }) => {
      showToast(`🎉 Token #${order.tokenNumber} is READY for Pickup at ${order.pickupCounter || 'Counter A'}!`, 'success');
    });

    const unsubCollected = eventBus.subscribe<{ order: StudentOrder }>(WORKFLOW_EVENTS.ORDER_COLLECTED, ({ order }) => {
      showToast(`Token #${order.tokenNumber} collected. Thank you!`, 'success');
    });

    return () => {
      unsubAccepted();
      unsubForwarded();
      unsubPreparing();
      unsubReady();
      unsubCollected();
    };
  }, [showToast]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, extra?: Partial<StudentOrder>) => {
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

          // Trigger EventBus
          if (status === 'ACCEPTED') eventBus.publish(WORKFLOW_EVENTS.ORDER_ACCEPTED, { order: nextOrder });
          if (status === 'SENT_TO_KITCHEN') eventBus.publish(WORKFLOW_EVENTS.FORWARDED_TO_KITCHEN, { order: nextOrder });
          if (status === 'PREPARING') eventBus.publish(WORKFLOW_EVENTS.PREPARATION_STARTED, { order: nextOrder });
          if (status === 'READY') eventBus.publish(WORKFLOW_EVENTS.ORDER_READY, { order: nextOrder });
          if (status === 'COLLECTED') eventBus.publish(WORKFLOW_EVENTS.ORDER_COLLECTED, { order: nextOrder });

          return nextOrder;
        }
        return order;
      });

      return updated;
    });
  }, []);

  const placeOrder = useCallback(
    (newOrderData: Omit<StudentOrder, 'id' | 'orderNumber' | 'tokenNumber' | 'createdAt' | 'queuePosition' | 'pickupCounter' | 'status'>) => {
      const tokenNumber = tokenGeneratorService.generateNextToken();
      const orderId = `ord-${Date.now()}`;
      const orderNumber = `CB-${Math.floor(1000 + Math.random() * 9000)}`;

      const createdOrder: StudentOrder = {
        ...newOrderData,
        id: orderId,
        orderNumber,
        tokenNumber,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        queuePosition: orders.length + 1,
        pickupCounter: 'Counter A',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TOKEN-${tokenNumber}-${orderNumber}`,
      };

      setOrders((prev) => [createdOrder, ...prev]);

      eventBus.publish(WORKFLOW_EVENTS.ORDER_PLACED, { order: createdOrder });
      showToast(`Order Placed! Your Token Number is #${tokenNumber}`, 'success');

      return createdOrder;
    },
    [orders.length, showToast]
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
