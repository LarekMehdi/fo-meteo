import { useAuthStore } from '@/stores/auth.store';
import axios, { type AxiosInstance } from 'axios';

export function useApi() {
  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // Instance dédiée au refresh (sans interceptors)
  const refreshApi: AxiosInstance = axios.create({
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

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthStore();

      if (error.response?.status === 401 && !isPublicRoute(originalRequest.url)) {
        if (originalRequest._retry || !authStore.refreshToken) {
          authStore.clearAuth();
          location.href = '/signin';
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const res = await refreshApi.get('auth/refresh', {
            headers: {
              'X-Refresh-Token': authStore.refreshToken,
            },
          });

          authStore.setAuthState(res.data);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        } catch {
          authStore.clearAuth();
          location.href = '/signin';
          return Promise.reject(error);
        }
      }

      if (error.response?.status === 403) {
        //TODO: location.href = '/error/403';
        location.href = '/';
      }

      return Promise.reject(error);
    },
  );

  return api;
}
