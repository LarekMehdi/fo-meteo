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

    <div class="relative w-12 h-7">
      <input
        type="checkbox"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
        class="peer opacity-0 w-0 h-0"
      />
      <div
        :class="[
          'absolute inset-0 rounded-full transition-colors duration-300',
          sliderBg,
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
      ></div>
      <div
        class="absolute left-0 top-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5 peer-disabled:opacity-50"
      ></div>
    </div>

    <small v-if="validation?.$dirty && validation?.$error" class="text-red-500 mt-1 block">
      {{ validation?.$errors[0]?.$message }}
    </small>
  </div>
</template>
