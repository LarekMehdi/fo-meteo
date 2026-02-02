<script lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import InputText from '@/components/inputs/InputText.vue';
import { useDebounceFn } from '@vueuse/core';

export default {
  props: {
    queryKeyPrefix: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    displayLabel: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    apiCall: {
      type: Function,
      required: true,
    },
    getResultLabel: {
      type: Function,
      required: true,
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const query = ref('');
    const results = ref<any[]>([]);
    const displayDropbox = ref(false);
    const skipNextFetch = ref(false);

    // query TanStack
    const queryResult = useQuery({
      queryKey: computed(() => [props.queryKeyPrefix, query.value]),
      queryFn: async () => {
        if (!query.value.trim()) return [];
        return props.apiCall(query.value.trim());
      },
      enabled: false,
      staleTime: 300_000, // 5 minutes
    });

    const debouncedFetch = useDebounceFn(async () => {
      if (skipNextFetch.value) {
        skipNextFetch.value = false;
        return;
      }

      const q = (query.value ?? '').toString();
      if (q.trim().length < 2) {
        results.value = [];
        displayDropbox.value = false;
        return;
      }

      await queryResult.refetch();
      results.value = queryResult.data.value || [];
      displayDropbox.value = results.value.length > 0;
    }, 300);

    watch(query, debouncedFetch);

    function handleSelect(item: any) {
      skipNextFetch.value = true;
      query.value = props.getResultLabel(item);
      displayDropbox.value = false;
      emit('select', item);
    }

    return {
      query,
      results,
      displayDropbox,
      handleSelect,
      queryResult,
    };
  },
  components: {
    InputText,
  },
};
</script>

<template>
  <div class="relative">
    <InputText
      v-model="query"
      :name="queryKeyPrefix"
      :content="label"
      :displayLabel="displayLabel"
      :placeholder="placeholder"
    />

    <ul
      v-if="displayDropbox"
      class="absolute z-10 w-full bg-white shadow-md rounded-md mt-1 max-h-60 overflow-auto"
    >
      <li
        v-for="(item, index) in results"
        :key="index"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        @click="handleSelect(item)"
      >
        {{ getResultLabel(item) }}
      </li>
    </ul>
  </div>
</template>
