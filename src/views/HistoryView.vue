<script lang="ts">
import Title from '@/components/shared/Title.vue';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

export default {
  setup() {
    return {};
  },
  components: {
    Title,
    DataTable,
    Column,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title content="Historique" subTitle="Relancez ou supprimez vos recherches sauvegardées" />

    <article class="overflow-x-auto">
      <DataTable
        class="table-class"
        :value="[]"
        tableStyle="min-width: 50rem"
        :loading="false"
        :scrollable="true"
        scrollHeight="500px"
        style="width: 100%"
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
              <p>{{ slotProps.data.createdAt }}</p>
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
              <p>sup</p>
            </section>
          </template>
        </Column>
      </DataTable>
    </article>
  </article>
</template>
