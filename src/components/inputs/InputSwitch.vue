<script lang="ts">
import { computed } from 'vue';

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: '',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    validation: {
      type: Object,
      required: false,
    },
    inputClass: {
      type: String,
      default: '',
    },
    labelClass: {
      type: String,
      default: 'text-left block',
    },
    displayLabel: {
      type: Boolean,
      default: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.checked);
    };

    const sliderBg = computed(() => (props.modelValue ? 'bg-blue-500' : 'bg-gray-300'));

    return { handleChange, sliderBg };
  },
};
</script>

<template>
  <div :class="inline ? 'flex items-center gap-2' : 'flex flex-col gap-1'">
    <label v-if="displayLabel" :for="name" :class="[labelClass, inline ? 'mb-0' : '']">
      {{ label }}
    </label>

    <label
      :for="name"
      class="relative inline-block w-12 h-7"
      :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
    >
      <input
        :id="name"
        type="checkbox"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
        class="sr-only peer"
      />
      <div
        :class="[
          'absolute inset-0 rounded-full transition-colors duration-300',
          sliderBg,
          disabled ? 'opacity-50' : '',
        ]"
      ></div>
      <div
        class="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-sm"
      ></div>
    </label>

    <small v-if="validation?.$dirty && validation?.$error" class="text-red-500 mt-1 block">
      {{ validation?.$errors[0]?.$message }}
    </small>
  </div>
</template>
