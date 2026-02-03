<script lang="ts">
import ButtonCustom from '../inputs/ButtonCustom.vue';
import ButtonSubmit from '../inputs/ButtonSubmit.vue';
import Row from './Row.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    submitLabel: {
      type: String,
      default: 'Confirmer',
    },
  },
  emits: ['close', 'submit'],
  watch: {
    visible(val: boolean) {
      document.body.style.overflow = val ? 'hidden' : '';
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      this.$emit('submit');
    },
  },
  components: {
    ButtonCustom,
    ButtonSubmit,
    Row,
  },
};
</script>

<template>
  <section
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="close"
  >
    <article class="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
      <h3 v-if="title" class="mb-4 pb-4 text-xl font-semibold">{{ title }}</h3>

      <section class="mb-4 flex justify-center">
        <i class="pi pi-exclamation-triangle text-red-500" style="font-size: 2rem"></i>
      </section>

      <form @submit.prevent="submit">
        <section class="mb-6 flex justify-center">
          <slot name="content" />
        </section>

        <Row>
          <template #left>
            <ButtonCustom content="Annuler" @click="close" />
          </template>
          <template #right>
            <ButtonSubmit
              :content="submitLabel"
              buttonColor="bg-red-500"
              buttonColorHover="hover:bg-red-700"
            />
          </template>
        </Row>
      </form>
    </article>
  </section>
</template>
