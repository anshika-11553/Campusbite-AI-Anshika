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

// Global Response & HTTP Retry Matrix Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    // Retry Logic for 5xx Server Errors & Network Failures (Max 3 Retries)
    if (config && (!error.response || (error.response.status >= 500 && error.response.status <= 504))) {
      config._retryCount = config._retryCount || 0;
      if (config._retryCount < 3) {
        config._retryCount += 1;
        const delayMs = Math.pow(2, config._retryCount) * 500; // Exponential Backoff: 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return apiClient(config);
      }
    }

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
