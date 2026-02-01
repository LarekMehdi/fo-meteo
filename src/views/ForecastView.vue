<script lang="ts">
import ButtonSubmit from '@/components/inputs/ButtonSubmit.vue';
import InputNumber from '@/components/inputs/InputNumber.vue';
import InputText from '@/components/inputs/InputText.vue';
import FormRow from '@/components/shared/FormRow.vue';
import Row from '@/components/shared/Row.vue';
import Title from '@/components/shared/Title.vue';
import type { ForecastFilterInterface } from '@/interfaces/filter.interface';
import useVuelidate from '@vuelidate/core';
import { reactive } from 'vue';

export default {
  setup() {
    // FORM
    const searchForm = reactive<ForecastFilterInterface>({
      latitude: null,
      longitude: null,
    });
    const searchRules = {};
    const v$ = useVuelidate(searchRules, searchForm);

    async function searchForecast() {
      try {
        console.log(searchForm);
      } catch (e: unknown) {}
    }
    return {
      v$,
      searchForm,
      searchForecast,
    };
  },
  components: {
    Title,
    InputText,
    InputNumber,
    ButtonSubmit,
    FormRow,
    Row,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title content="Voir les prévisions" subTitle="Recherchez une ville ou des coordonnées" />

    <section>
      <form @submit.prevent="searchForecast" class="flex flex-col gap-4 w-full">
        <FormRow :cols="2">
          <InputNumber
            v-model="searchForm.latitude"
            name="latitude"
            label="Latitude"
            placeholder="Latitude"
            :isRequired="true"
            :inline="false"
            :displayLabel="true"
            :validation="v$.latitude"
          />
          <InputNumber
            v-model="searchForm.longitude"
            name="longitude"
            label="Longitude"
            placeholder="Longitude"
            :isRequired="true"
            :inline="false"
            :displayLabel="true"
            :validation="v$.longitude"
          />
        </FormRow>
        <Row>
          <template #left>
            <ButtonSubmit content="Rechercher" />
          </template>
        </Row>
      </form>
    </section>
  </article>
</template>
