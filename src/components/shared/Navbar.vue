<script lang="ts">
import { useRouter } from 'vue-router';
import NavLink from './NavLink.vue';
import Row from './Row.vue';
import { useAuthStore } from '@/stores/auth.store';
import { computed } from 'vue';
import ButtonCustom from '../inputs/ButtonCustom.vue';

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const isLoggedIn = computed(() => authStore.isLoggedIn);

    function goToHome() {
      router.push('/');
    }

    function logout() {
      authStore.logout();
      goToHome();
    }

    return {
      isLoggedIn,
      goToHome,
      logout,
    };
  },
  components: {
    Row,
    NavLink,
    ButtonCustom,
  },
};
</script>

<template>
  <Row class="h-16 px-3 sm:px-6 lg:px-10">
    <template #left>
      <div class="relative flex items-center gap-3 sm:gap-6">
        <p @click="goToHome" class="font-bold text-sm sm:text-base cursor-pointer">Météo</p>

        <div v-if="isLoggedIn" class="hidden md:flex items-center gap-6">
          <NavLink to="/forecast">Prévisions</NavLink>
          <NavLink to="/history">Historique</NavLink>
        </div>
      </div>
    </template>

    <template #right>
      <ButtonCustom
        v-if="isLoggedIn"
        @click="logout"
        content="Se déconnecter"
        buttonColor="bg-red-500"
        buttonColorHover="hover:bg-red-700"
      />
    </template>
  </Row>

  <hr class="w-full border-t border-gray-300 mt-0" />
</template>
