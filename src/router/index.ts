import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SigninView from '@/views/auth/SigninView.vue';
import SignupView from '@/views/auth/SignupView.vue';
import ForecastView from '@/views/ForecastView.vue';
import HistoryView from '@/views/HistoryView.vue';

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
    },
    // HISTORIQUE
    {
      path: '/history',
      name: 'history',
      component: HistoryView,
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

export default router;
