<script lang="ts">
import ButtonCustom from '@/components/inputs/ButtonCustom.vue';
import Title from '@/components/shared/Title.vue';
import type { HistoryFilterInterface, PageInterface } from '@/interfaces/filter.interface';
import type { SearchHistoryInterface } from '@/interfaces/searchHistory.interface';
import { SearchForecastHistoryService } from '@/services/searchForecastHistory.service';
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { reactive, computed } from 'vue';

export default {
  setup() {
    const filter = reactive<HistoryFilterInterface>({
      limit: 5,
      page: 1,
    });
    const queryKey = computed(() => ['all-histories', filter.page, filter.limit]);

    const historiesQuery: UseQueryReturnType<
      PageInterface<SearchHistoryInterface>,
      Error
    > = useQuery({
      queryKey,
      queryFn: () => SearchForecastHistoryService.getHistories(filter),
      staleTime: 1000 * 60 * 5,
    });

    const histories = computed(() => historiesQuery.data.value?.datas || []);
    const totalRecords = computed(() => historiesQuery.data.value?.totalElements || 0);
    const isLoading = computed(() => historiesQuery.isLoading.value);

    function replaySearch(item: SearchHistoryInterface) {
      console.log(item);
    }

    function onPage(event: { page: number; rows: number }) {
      filter.page = event.page + 1;
      filter.limit = event.rows;
    }

    return {
      filter,
      historiesQuery,
      histories,
      totalRecords,
      isLoading,
      onPage,
      replaySearch,
    };
  },
  components: {
    Title,
    DataTable,
    Column,
    ButtonCustom,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title content="Historique" subTitle="Relancez ou supprimez vos recherches sauvegardées" />

    <article class="overflow-x-auto">
      <DataTable
        :value="histories"
        :loading="isLoading"
        :paginator="true"
        :rows="filter.limit"
        :totalRecords="totalRecords"
        :first="(filter.page - 1) * filter.limit"
        :lazy="true"
        @page="onPage"
      >
        <template #empty>
          <div class="text-center py-8 text-gray-500">Aucunes recherches sauvegardées</div>
        </template>

        <template #loading>
          <div class="text-center py-8">
            <span class="text-gray-600">Chargement...</span>
          </div>
        </template>

        <Column field="createdAt" header="Date" sortable style="width: 10%">
          <template #body="slotProps">
            <section class="flex items-center gap-8">
              <p>{{ new Date(slotProps.data.createdAt).toLocaleDateString('fr-FR') }}</p>
            </section>
          </template>
        </Column>
        <Column field="latitude" header="Latitude" sortable style="width: 10%"></Column>
        <Column field="longitude" header="Longitude" sortable style="width: 10%"></Column>
        <Column field="windSpeed10m" header="Vitesse du vent" sortable style="width: 10%">
          <template #body="slotProps">
            <section class="flex items-center gap-8">
              <p>{{ slotProps.data.windSpeed10m }}</p>
            </section>
          </template>
        </Column>
        <Column field="windSpeedUnit" header="Unité du vent" sortable style="width: 10%"></Column>
        <Column header="Action" style="width: 10%">
          <template #body="slotProps">
            <section class="flex items-center gap-8">
              <ButtonCustom @click="() => replaySearch(slotProps.data)" content="Relancer" />
            </section>
          </template>
        </Column>
      </DataTable>
    </article>
  </article>
</template>
