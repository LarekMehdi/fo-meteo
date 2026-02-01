<script lang="ts">
import { type PropType } from 'vue';

export default {
  props: {
    modelValue: {
      type: [Number, null] as PropType<number | null>,
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
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    validation: {
      type: Object,
      required: false,
    },
    inputClass: {
      type: String,
      required: false,
      default: 'flex-1 px-3 py-1',
    },
    labelClass: {
      type: String,
      required: false,
      default: 'whitespace-nowrap',
    },
    displayLabel: {
      type: Boolean,
      required: false,
      default: true,
    },
    inline: {
      type: Boolean,
      required: false,
      default: false,
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    symbol: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = (event: Event) => {
      const raw = (event.target as HTMLInputElement).value;
      emit('update:modelValue', raw === '' ? null : Number(raw));
    };

    return {
      onInput,
      props,
    };
  },
};
</script>

<template>
  <div :class="props.inline ? 'flex items-center gap-2 w-full' : 'w-full'">
    <label v-if="props.displayLabel" :for="props.name" :class="props.labelClass">
      {{ props.label }} {{ props.isRequired && props.displayLabel ? ' *' : '' }}
    </label>

    <aside class="flex items-center border rounded-lg overflow-hidden w-full">
      <input
        type="number"
        :name="props.name"
        :placeholder="props.placeholder"
        :class="`${props.inputClass} pl-4 flex-1`"
        :value="props.modelValue"
        :disabled="props.disabled"
        @input="onInput"
      />
      <span v-if="props.symbol" class="px-2 border-l">{{ props.symbol }}</span>
    </aside>

    <small v-if="props.validation?.$dirty && props.validation?.$error" class="text-red-500">
      {{ props.validation?.$errors[0]?.$message }}
    </small>
  </div>
</template>
