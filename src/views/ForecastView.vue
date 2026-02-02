<script lang="ts">
import ButtonSubmit from '@/components/inputs/ButtonSubmit.vue';
import CityAutocomplete from '@/components/inputs/CityAutocomplete.vue';
import InputNumber from '@/components/inputs/InputNumber.vue';
import InputText from '@/components/inputs/InputText.vue';
import Card from '@/components/shared/Card.vue';
import FormRow from '@/components/shared/FormRow.vue';
import Row from '@/components/shared/Row.vue';
import Title from '@/components/shared/Title.vue';
import { getWeatherIcon } from '@/constants/weatherCode.constant';
import type { City } from '@/interfaces/city.interface';
import type { ForecastFilterInterface } from '@/interfaces/filter.interface';
import type {
  ForecastInterface,
  HourlyForecastDisplayInterface,
} from '@/interfaces/forecast.interface';
import { ForecastService } from '@/services/forecast.service';
import { withMessage } from '@/utils/helpers/withMessage';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
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
      hourly: true,
      weatherCode: true,
      windSpeed10m: true,
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

    // COMPUTED
    //TODO: refacto
    const todayHourlyForecast = computed<HourlyForecastDisplayInterface[]>(() => {
      if (!forecast.value) return [];

      const today = new Date().toISOString().split('T')[0];

      return forecast.value.hourly.time
        .map((time, index) => {
          const temperature = forecast.value!.hourly.temperature2m[index];
          const weatherCode = forecast.value!.hourly.weatherCode[index];
          const windSpeed10m = forecast.value!.hourly.windSpeed10m[index];

          if (temperature === undefined) return null;

          return {
            time,
            temperature,
            weatherCode,
            windSpeed10m,
          };
        })
        .filter(
          (item): item is HourlyForecastDisplayInterface =>
            item !== null && item.time.startsWith(today!),
        );
    });
    const temperatureUnit = computed<string>(() => {
      return forecast.value?.hourlyUnits.temperature2m || '';
    });
    const windSpeedUnit = computed<string>(() => {
      return forecast.value?.hourlyUnits.windSpeedUnit || '';
    });

    // METHODS
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

    function handleCitySelect(city: City) {
      searchForm.latitude = city.latitude;
      searchForm.longitude = city.longitude;
      searchForm.cityName = city.name;
    }
    return {
      v$,
      searchForm,
      temperatureUnit,
      windSpeedUnit,
      todayHourlyForecast,
      forecast,
      getWeatherIcon,
      searchForecast,
      handleCitySelect,
    };
  },
  components: {
    Title,
    InputText,
    InputNumber,
    CityAutocomplete,
    ButtonSubmit,
    FormRow,
    Row,
    Card,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title content="Voir les prévisions" subTitle="Recherchez une ville ou des coordonnées" />
    <section>
      <form @submit.prevent="searchForecast" class="flex flex-col gap-4 w-full">
        <FormRow :cols="2">
          <CityAutocomplete @update:modelValue="handleCitySelect" />
        </FormRow>
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

    <Card>
      <section v-if="todayHourlyForecast.length" class="flex gap-4 overflow-x-auto py-2">
        <Card
          v-for="(hour, index) in todayHourlyForecast"
          :key="index"
          class="min-w-[100px] p-2 flex flex-col items-center gap-1"
        >
          <span class="text-2xl"> {{ getWeatherIcon(hour.weatherCode) }} </span>
          <span class="text-xs text-gray-400"> {{ new Date(hour.time).getHours() }}h </span>
          <span class="text-sm font-semibold"> {{ hour.temperature }}{{ temperatureUnit }} </span>
          <span class="text-xs text-gray-400">💨 {{ hour.windSpeed10m }}{{ windSpeedUnit }} </span>
        </Card>
      </section>
    </Card>
  </article>
</template>
