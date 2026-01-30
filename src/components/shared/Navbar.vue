<script lang="ts">
import { useRouter } from 'vue-router';
import NavLink from './NavLink.vue';
import Row from './Row.vue';

export default {
  setup() {
    const router = useRouter();

    function goToHome() {
      router.push('/');
    }

    return {
      goToHome,
    };
  },
  components: {
    Row,
    NavLink,
  },
};
</script>

<template>
  <Row class="h-16 px-3 sm:px-6 lg:px-10">
    <template #left>
      <div class="relative flex items-center gap-3 sm:gap-6">
        <p @click="goToHome" class="font-bold text-sm sm:text-base cursor-pointer">Météo</p>

        <div class="hidden md:flex items-center gap-6">
          <NavLink to="/forecast">Prévisions</NavLink>
        </div>
      </div>
    </template>
  </Row>

  <hr class="w-full border-t border-gray-300 mt-0" />
</template>
