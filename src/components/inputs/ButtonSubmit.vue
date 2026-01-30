<script lang="ts">
export default {
  props: {
    buttonColor: {
      type: String,
      required: false,
      default: 'bg-blue-600',
    },
    buttonColorHover: {
      type: String,
      required: false,
      default: 'hover:bg-blue-700',
    },
    content: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('click');
    };
    return {
      props,
      handleClick,
    };
  },
};
</script>

<template>
  <button
    type="submit"
    :class="[
      props.buttonColor,
      props.buttonColorHover,
      'py-2 px-4 rounded active:shadow-lg min-w-[150px] text-white transition-colors',
    ]"
    @click="handleClick"
  >
    {{ props.content }}
  </button>
</template>
