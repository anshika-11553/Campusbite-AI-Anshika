export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
  },
  MENU: {
    ITEMS: '/menu',
    CATEGORIES: '/menu/categories',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    STATUS: (id: string) => `/orders/${id}/status`,
  },
  PAYMENTS: {
    CREATE: '/payments/create',
    VERIFY: '/payments/verify',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
  },
  VENDOR: {
    ORDERS: '/vendor/orders',
    ANALYTICS: '/vendor/analytics',
  },
  CHIEF: {
    QUEUE: '/chief/queue',
  },
} as const;
