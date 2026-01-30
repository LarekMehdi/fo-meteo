<script lang="ts">
export default {
  props: {
    width: {
      type: String,
      required: false,
      default: 'min-w-50',
    },
    height: {
      type: String,
      required: false,
      default: 'min-h-48',
    },
  },
};
</script>

<template>
  <article :class="`${width} ${height} bg-white border rounded-lg shadow-md p-6 flex flex-col`">
    <slot></slot>
  </article>
</template>
