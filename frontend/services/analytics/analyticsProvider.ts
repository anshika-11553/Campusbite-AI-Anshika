export interface IAnalyticsProvider {
  trackMenuSearch(query: string): void;
  trackCategoryFilter(category: string): void;
  trackAddToCart(itemId: string, itemName: string, priceInINR: number): void;
  trackRemoveFromCart(itemId: string, itemName: string): void;
  trackCheckoutStarted(itemCount: number, totalInINR: number): void;
  trackOrderPlaced(orderId: string, totalInINR: number): void;
  trackQRCodeViewed(orderId: string): void;
}
