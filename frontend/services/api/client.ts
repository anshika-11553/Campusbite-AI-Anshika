import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { firebaseAuthProvider } from '@/services/auth/firebaseAuth';
import { ROUTES } from '@/constants/routes';

export const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://clerical-animosity-flint.ngrok-free.dev/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 15000,
});

// Dynamic Auth Token & Header Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken && config.headers) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        } else {
          const fbToken = await firebaseAuthProvider.getToken();
          if (fbToken && config.headers) {
            config.headers.Authorization = `Bearer ${fbToken}`;
          }
        }
      }
    } catch {
      // Ignore token fetch errors for public routes
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Global Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    // Retry Logic for 5xx Server Errors & Network Failures (Max 2 Retries)
    if (config && (!error.response || (error.response.status >= 500 && error.response.status <= 504))) {
      config._retryCount = config._retryCount || 0;
      if (config._retryCount < 2) {
        config._retryCount += 1;
        const delayMs = Math.pow(2, config._retryCount) * 500;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return apiClient(config);
      }
    }

    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        // 401 Unauthorized -> Clear stored token
        localStorage.removeItem('auth_token');
      } else if (error.response?.status === 403) {
        window.location.href = ROUTES.UNAUTHORIZED;
      }
    }

    return Promise.reject(error);
  }
);
