<script lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();

    const isActive = computed(() => route.path === props.to);
    const linkClass = computed(() => (isActive.value ? 'text-black' : 'text-gray-500'));

    return {
      isActive,
      linkClass,
    };
  },
};
</script>

<template>
  <router-link :to="to" :class="linkClass">
    <slot></slot>
  </router-link>
</template>
