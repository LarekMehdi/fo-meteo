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
  DailyForecastInterface,
  ForecastInterface,
  HourlyForecastDisplayInterface,
} from '@/interfaces/forecast.interface';
import { ForecastService } from '@/services/forecast.service';
import { SearchForecastHistoryService } from '@/services/searchForecastHistory.service';
import { withMessage } from '@/utils/helpers/withMessage';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';
import { useQueryClient } from '@tanstack/vue-query';
import InputSwitch from '@/components/inputs/InputSwitch.vue';
import { getWindSpeedUnitOptions, WindSpeedUnit } from '@/constants/windSpeedUnit.constant';
import InputSelect from '@/components/inputs/InputSelect.vue';
import { UtilDate } from '@/utils/date.utils';
import { UtilForecast } from '@/utils/forecast.utils';

export default {
  setup() {
    const toast = useToast();
    const route = useRoute();
    const queryClient = useQueryClient();

    const forecast = ref<ForecastInterface | null>(null);
    const isLoading = ref(false);
    const displayWeekResults = ref(false);

    // FORM
    const searchForm = reactive<ForecastFilterInterface>({
      latitude: null,
      longitude: null,
      hourly: true,
      weatherCode: true,
      windSpeed10m: true,
      windSpeedUnit: WindSpeedUnit.KMH,
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
    const todayHourlyForecast = computed<HourlyForecastDisplayInterface[]>(() => {
      if (!forecast.value) return [];
      return UtilForecast.getTodayHourlyForecast(forecast.value);
    });
    const weeklyForecast = computed<DailyForecastInterface[]>(() => {
      if (!forecast.value) return [];
      return UtilForecast.getWeeklyForecast(forecast.value);
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
        forecast.value = await ForecastService.getForecast(searchForm);
      } catch (e: unknown) {
        toast.error('Une erreur est survenue');
      } finally {
        isLoading.value = false;
      }
    }
    async function saveCurrentSearch() {
      if (!forecast) return;

      try {
        await SearchForecastHistoryService.create(searchForm);
        toast.success('Recherche sauvegardée!');
        queryClient.invalidateQueries({ queryKey: ['all-histories'] });
      } catch (_e: unknown) {
        toast.error('Impossible de sauvegarder la recherche.');
      }
    }

    function handleCitySelect(city: City) {
      searchForm.latitude = city.latitude;
      searchForm.longitude = city.longitude;
      searchForm.cityName = city.name;
    }
    function alternDisplayWeekResults() {
      displayWeekResults.value = !displayWeekResults.value;
    }

    onMounted(() => {
      if (route.query.latitude && route.query.longitude) {
        searchForm.latitude = Number(route.query.latitude);
        searchForm.longitude = Number(route.query.longitude);

        if (route.query.windSpeed10m) {
          searchForm.windSpeed10m = route.query.windSpeed10m === 'true';
        }

        searchForecast();
      }
    });

    return {
      v$,
      searchForm,
      temperatureUnit,
      windSpeedUnit,
      todayHourlyForecast,
      forecast,
      displayWeekResults,
      weeklyForecast,
      getWeatherIcon,
      searchForecast,
      handleCitySelect,
      saveCurrentSearch,
      getWindSpeedUnitOptions,
      alternDisplayWeekResults,
      UtilDate,
    };
  },
  components: {
    Title,
    InputText,
    InputNumber,
    InputSwitch,
    InputSelect,
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
        <FormRow :cols="2">
          <InputSwitch
            v-model="searchForm.windSpeed10m"
            name="windSpeed10m"
            label="Afficher la vitesse du vent"
            :displayLabel="true"
            :inline="true"
          />
          <InputSelect
            v-if="searchForm.windSpeed10m"
            v-model="searchForm.windSpeedUnit"
            name="status"
            label="Status"
            placeholder="Status"
            :inline="true"
            :displayLabel="false"
            :options="getWindSpeedUnitOptions()"
          />
        </FormRow>

        <Row>
          <template #left>
            <ButtonSubmit content="Rechercher" />
            <ButtonSubmit
              v-if="forecast"
              content="Sauvegarder la recherche"
              buttonColor="bg-green-600"
              buttonColorHover="hover:bg-green-700"
              @click="saveCurrentSearch"
            />
          </template>
        </Row>
      </form>
    </section>

    <Card v-if="todayHourlyForecast.length">
      <Row>
        <template #left>
          <p>Aujourd'hui</p>
        </template>
      </Row>
      <section class="flex gap-4 overflow-x-auto py-2">
        <Card
          v-for="(hour, index) in todayHourlyForecast"
          :key="index"
          class="min-w-[100px] p-2 flex flex-col items-center gap-1"
        >
          <span class="text-2xl"> {{ getWeatherIcon(hour.weatherCode) }} </span>
          <span class="text-xs text-gray-400"> {{ new Date(hour.time).getHours() }}h </span>
          <span class="text-sm font-semibold"> {{ hour.temperature }}{{ temperatureUnit }} </span>
          <span v-if="hour.windSpeed10m" class="text-xs text-gray-400"
            >💨 {{ hour.windSpeed10m }}{{ windSpeedUnit }}
          </span>
        </Card>
      </section>
    </Card>

    <section v-if="todayHourlyForecast.length">
      <Row>
        <template #left>
          <p>
            Semaine prochaine
            <i
              @click="alternDisplayWeekResults()"
              :class="[
                'pi',
                displayWeekResults ? 'pi-chevron-down' : 'pi-chevron-right',
                'cursor-pointer',
                'text-blue-600',
                'hover:text-blue-800',
              ]"
              :title="displayWeekResults ? 'Fermer' : 'Ouvrir'"
            ></i>
          </p>
        </template>
      </Row>
      <Card v-if="displayWeekResults && weeklyForecast.length" class="mt-2">
        <section class="flex justify-center gap-4 overflow-x-auto py-2">
          <Card
            v-for="(day, index) in weeklyForecast"
            :key="index"
            class="min-w-[120px] p-3 flex flex-col items-center gap-2"
          >
            <span class="text-sm font-medium text-gray-600 capitalize">
              {{ UtilDate.formatToFrFullName(day.date) }}
            </span>
            <span class="text-3xl">
              {{ getWeatherIcon(day.weatherCode) }}
            </span>
            <div class="flex gap-2 text-sm">
              <span class="font-semibold text-red-500">
                {{ Math.round(day.maxTemp) }}{{ temperatureUnit }}
              </span>
              <span class="text-gray-400">/</span>
              <span class="text-blue-500">
                {{ Math.round(day.minTemp) }}{{ temperatureUnit }}
              </span>
            </div>
          </Card>
        </section>
      </Card>
    </section>
  </article>
</template>
