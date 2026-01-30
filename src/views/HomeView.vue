<script lang="ts">
import Title from '@/components/shared/Title.vue';

export default {
  setup() {
    return {};
  },
  components: {
    Title,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title
      content="La météo du monde"
      subTitle="Explorez les prévisions météorologiques de n'importe où dans le monde"
    />
  </article>
</template>
