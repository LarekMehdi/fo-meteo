import { defineStore } from 'pinia';
import type { AuthStoreInterface } from '../interfaces/user.interface';
import { AuthService } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreInterface => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
  },
  actions: {
    setAuthState(authData: AuthStoreInterface) {
      this.accessToken = authData.accessToken;
      this.refreshToken = authData.refreshToken;
      this.user = authData.user;
    },
    clearAuth() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
    },
    async logout() {
      try {
        if (this.refreshToken) {
          await AuthService.logout(this.refreshToken);
        }
      } catch (_e: unknown) {
        console.warn('Erreur lors du logout');
      } finally {
        this.clearAuth();
      }
    },
  },
  persist: true,
});
