<script lang="ts">
import ButtonSubmit from '@/components/inputs/ButtonSubmit.vue';
import InputNumber from '@/components/inputs/InputNumber.vue';
import InputText from '@/components/inputs/InputText.vue';
import FormRow from '@/components/shared/FormRow.vue';
import Row from '@/components/shared/Row.vue';
import Title from '@/components/shared/Title.vue';
import type { ForecastFilterInterface } from '@/interfaces/filter.interface';
import type { ForecastInterface } from '@/interfaces/forecast.interface';
import { ForecastService } from '@/services/forecast.service';
import { withMessage } from '@/utils/helpers/withMessage';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const toast = useToast();

    const forecast = ref<ForecastInterface | null>(null);
    const isLoading = ref(false);

    // FORM
    const searchForm = reactive<ForecastFilterInterface>({
      latitude: null,
      longitude: null,
    });
    const searchRules = {
      latitude: {
        required: withMessage('La latitude est requise', required),
      },
      longitude: {
        required: withMessage('La longitude est requise', required),
      },
    };
    const v$ = useVuelidate(searchRules, searchForm);

    async function searchForecast() {
      const isValid = await v$.value.$validate();
      if (!isValid) return;

      try {
        isLoading.value = true;
        console.log(searchForm);
        forecast.value = await ForecastService.getForecast(searchForm);
      } catch (e: unknown) {
        toast.error('Une erreur est survenue');
      } finally {
        isLoading.value = false;
      }
    }
    return {
      v$,
      searchForm,
      forecast,
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
