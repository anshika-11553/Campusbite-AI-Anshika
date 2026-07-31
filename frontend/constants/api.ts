export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  MENU: {
    LIST: '/menu',
    SEARCH: '/menu/search',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    STATUS: (id: string) => `/orders/${id}/status`,
  },
  VENDOR: {
    ORDERS: '/vendor/orders',
    DASHBOARD: '/vendor/dashboard',
    POPULAR_ITEMS: '/vendor/popular-items',
    QUEUE: '/vendor/queue',
    ANALYTICS: '/vendor/analytics',
  },
} as const;
