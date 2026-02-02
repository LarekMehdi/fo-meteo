<script lang="ts">
import InputAutocomplete from '@/components/inputs/InputAutocomplete.vue';
import type { Ref } from 'vue';
import { ForecastService } from '@/services/forecast.service';
import type { City } from '@/interfaces/city.interface';

export default {
  props: {
    modelValue: {
      type: Object as () => City | null,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    async function fetchCities(query: string): Promise<City[]> {
      if (!query.trim()) return [];
      try {
        return await ForecastService.searchCity(query);
      } catch (e: unknown) {
        console.error('Erreur lors de la recherche de villes', e);
        return [];
      }
    }

    function handleSelect(city: City) {
      emit('update:modelValue', city);
    }

    function getCityLabel(city: City) {
      return `${city.name}, ${city.country}`;
    }

    return {
      fetchCities,
      handleSelect,
      getCityLabel,
    };
  },
  components: {
    InputAutocomplete,
  },
};
</script>

<template>
  <InputAutocomplete
    queryKeyPrefix="city"
    label="Ville"
    placeholder="Rechercher une ville..."
    :apiCall="fetchCities"
    :getResultLabel="getCityLabel"
    @select="handleSelect"
  />
</template>
