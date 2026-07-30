import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { firebaseAuthProvider } from '@/services/auth/firebaseAuth';
import { ROUTES } from '@/constants/routes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Dynamic Auth Token Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await firebaseAuthProvider.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore token fetch errors for public routes
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Global Response & HTTP Error Matrix Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        // 401 Unauthorized -> Clear auth state & redirect to login
        await firebaseAuthProvider.logout();
        window.location.href = ROUTES.LOGIN;
      } else if (error.response?.status === 403) {
        // 403 Forbidden -> Redirect to unauthorized page
        window.location.href = ROUTES.UNAUTHORIZED;
      }
    }
    return Promise.reject(error);
  }
);
