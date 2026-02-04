import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SigninView from '@/views/auth/SigninView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import ForecastView from '@/views/ForecastView.vue';
import HistoryView from '@/views/HistoryView.vue';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // METEO
    {
      path: '/forecast',
      name: 'forecast',
      component: ForecastView,
      meta: { requiresAuth: true },
    },
    // HISTORIQUE
    {
      path: '/history',
      name: 'history',
      component: HistoryView,
      meta: { requiresAuth: true },
    },
    // AUTH
    {
      path: '/signin',
      name: 'signin',
      component: SigninView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuthStore();

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'signin' });
  }

  if ((to.name === 'signin' || to.name === 'signup') && isLoggedIn) {
    return next({ name: 'home' });
  }

  return next();
});

export default router;
