import axios, { type AxiosInstance } from 'axios';
import qs from 'qs';
import { useAuthStore } from '../stores/auth.store';

export function useApi() {
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;
  const refreshToken = authStore.refreshToken;

  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

  // Juste avant l'envoi de la requète
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.url === 'auth/logout') {
      config.headers.Authorization = `Bearer ${refreshToken}`;
    }

    return config;
  });

  // TODO: refreshToken
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401) {
        authStore.clearAuth();
        location.href = '/signin';
      }
      if (
        error.response &&
        error.response.status === 403 &&
        originalRequest.url !== 'auth/signup' &&
        originalRequest.url !== 'auth/signin'
      ) {
        location.href = '/error/403';
        console.log('Accés refusé');
      }
      return Promise.reject(error);
    },
  );

  return api;
}
