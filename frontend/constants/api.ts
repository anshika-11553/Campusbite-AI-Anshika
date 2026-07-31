export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/api/${API_VERSION}/auth/login`,
    LOGOUT: `/api/${API_VERSION}/auth/logout`,
    ME: `/api/${API_VERSION}/auth/me`,
    REFRESH: `/api/${API_VERSION}/auth/refresh`,
  },
  USERS: {
    PROFILE: `/api/${API_VERSION}/users/profile`,
  },
  MENU: {
    ITEMS: `/api/${API_VERSION}/menu/items`,
    CATEGORIES: `/api/${API_VERSION}/menu/categories`,
  },
  ORDERS: {
    LIST: `/api/${API_VERSION}/orders`,
    CREATE: `/api/${API_VERSION}/orders`,
    STATUS: (id: string) => `/api/${API_VERSION}/orders/${id}/status`,
  },
  NOTIFICATIONS: {
    LIST: `/api/${API_VERSION}/notifications`,
  },
} as const;
