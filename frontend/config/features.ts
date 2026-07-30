export interface FeatureFlags {
  enableCheckout: boolean;
  enableQueueTracking: boolean;
  enableQRCode: boolean;
  enableOrderHistory: boolean;
}

export const featureFlags: FeatureFlags = {
  enableCheckout: true,
  enableQueueTracking: true,
  enableQRCode: true,
  enableOrderHistory: true,
};
