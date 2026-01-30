<script lang="ts">
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    return {
      props,
    };
  },
};
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold mb-3">{{ props.content }}</h1>
    <p v-if="subTitle" class="text-gray-500 mb-10">{{ props.subTitle }}</p>
  </section>
</template>

<style scoped></style>
