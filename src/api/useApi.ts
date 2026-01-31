import { useAuthStore } from '@/stores/auth.store';
import axios, { type AxiosInstance } from 'axios';

export function useApi() {
  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  function isPublicRoute(url?: string) {
    return url?.includes('auth/signup') || url?.includes('auth/signin');
  }

  api.interceptors.request.use((config) => {
    const authStore = useAuthStore();

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    if (config.url?.includes('auth/refresh')) {
      config.headers['X-Refresh-Token'] = authStore.refreshToken;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthStore();

      if (error.response?.status === 401 && !isPublicRoute(originalRequest.url)) {
        if (originalRequest.url?.includes('auth/refresh') || !authStore.refreshToken) {
          authStore.clearAuth();
          location.href = '/signin';
          return Promise.reject(error);
        }

        try {
          const res = await api.get('auth/refresh');
          authStore.setAuthState(res.data);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        } catch {
          authStore.clearAuth();
          location.href = '/signin';
          return Promise.reject(error);
        }
      }

      if (error.response?.status === 403 && !isPublicRoute(originalRequest.url)) {
        //TODO: location.href = '/error/403';
        location.href = '/';
      }

      return Promise.reject(error);
    },
  );

  return api;
}
