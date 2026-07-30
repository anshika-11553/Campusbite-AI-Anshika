import { StudentOrder } from '@/types/student';

class QueueManagerService {
  /**
   * Calculates live queue position for a given order ID.
   */
  calculateQueuePosition(orders: StudentOrder[], orderId: string): number {
    const activeQueue = orders.filter(
      (o) => o.status === 'PENDING' || o.status === 'ACCEPTED' || o.status === 'SENT_TO_KITCHEN' || o.status === 'PREPARING'
    );
    const targetIdx = activeQueue.findIndex((o) => o.id === orderId);
    return targetIdx >= 0 ? targetIdx + 1 : 1;
  }

  /**
   * Calculates estimated wait time in minutes based on active queue length and item complexity.
   */
  estimateWaitTime(orders: StudentOrder[], orderId: string): number {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return 10;

    const activeBefore = orders.filter(
      (o) =>
        (o.status === 'PENDING' || o.status === 'ACCEPTED' || o.status === 'SENT_TO_KITCHEN' || o.status === 'PREPARING') &&
        new Date(o.createdAt).getTime() <= new Date(target.createdAt).getTime()
    );

    const baseMinutes = activeBefore.reduce((acc, item) => acc + (item.estimatedPreparationTimeMinutes || 8), 0);
    return Math.max(5, Math.ceil(baseMinutes / 2));
  }
}

export const queueManagerService = new QueueManagerService();
