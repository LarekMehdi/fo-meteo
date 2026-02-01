<script lang="ts">
export default {
  props: {
    cols: {
      type: Number,
      required: false,
      default: 1,
    },
  },
};
</script>

<template>
  <section class="grid gap-4" :class="cols === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'">
    <slot />
  </section>
</template>
