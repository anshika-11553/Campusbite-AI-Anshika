import { IAnalyticsProvider } from './analyticsProvider';
import { logger } from '@/utils/logger';

class ConsoleAnalyticsProvider implements IAnalyticsProvider {
  trackMenuSearch(query: string): void {
    logger.log('[Analytics] Menu Search:', query);
  }
  trackCategoryFilter(category: string): void {
    logger.log('[Analytics] Category Filter:', category);
  }
  trackAddToCart(itemId: string, itemName: string, priceInINR: number): void {
    logger.log('[Analytics] Add to Cart:', { itemId, itemName, priceInINR });
  }
  trackRemoveFromCart(itemId: string, itemName: string): void {
    logger.log('[Analytics] Remove from Cart:', { itemId, itemName });
  }
  trackCheckoutStarted(itemCount: number, totalInINR: number): void {
    logger.log('[Analytics] Checkout Started:', { itemCount, totalInINR });
  }
  trackOrderPlaced(orderId: string, totalInINR: number): void {
    logger.log('[Analytics] Order Placed:', { orderId, totalInINR });
  }
  trackQRCodeViewed(orderId: string): void {
    logger.log('[Analytics] QR Code Viewed:', orderId);
  }
}

export const analytics: IAnalyticsProvider = new ConsoleAnalyticsProvider();
