<script lang="ts">
import ButtonCustom from '@/components/inputs/ButtonCustom.vue';
import ModalConfirm from '@/components/shared/ModalConfirm.vue';
import Title from '@/components/shared/Title.vue';
import type { HistoryFilterInterface, PageInterface } from '@/interfaces/filter.interface';
import type { SearchHistoryInterface } from '@/interfaces/searchHistory.interface';
import { SearchForecastHistoryService } from '@/services/searchForecastHistory.service';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery, useQueryClient, type UseQueryReturnType } from '@tanstack/vue-query';
import { AxiosError } from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { reactive, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();
    const queryClient = useQueryClient();
    const displayConfirmDeleteModal = ref(false);
    let historyIdToDelete: number | null = null;
    const filter = reactive<HistoryFilterInterface>({
      limit: 5,
      page: 1,
    });
    const queryKey = computed(() => [
      'all-histories',
      filter.page,
      filter.limit,
      authStore.user?.id,
    ]);

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
      router.push({
        name: 'forecast',
        query: {
          latitude: item.latitude.toString(),
          longitude: item.longitude.toString(),
          windSpeed10m: item.windSpeed10m.toString(),
        },
      });
    }

    function alternDisplayConfirmDeleteModal(id: number | null) {
      displayConfirmDeleteModal.value = !displayConfirmDeleteModal.value;
      historyIdToDelete = id;
    }

    async function deleteHistory() {
      if (!historyIdToDelete) {
        toast.error('Pas de dropzone a supprimer');
        return;
      }

      try {
        await SearchForecastHistoryService.delete(historyIdToDelete);
        alternDisplayConfirmDeleteModal(null);
        toast.success('Recherche supprimée');
        queryClient.invalidateQueries({ queryKey: ['all-histories'] });
        historiesQuery.refetch();
      } catch (e: unknown) {
        if (e instanceof AxiosError && e.response) {
          switch (e.response.status) {
            case 404:
              toast.error("Cette recherche n'existe pas");
              break;
            default:
              toast.error('Erreur serveur');
          }
        } else {
          toast.error('Une erreur est survenue');
        }
      }
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
      displayConfirmDeleteModal,
      onPage,
      replaySearch,
      deleteHistory,
      alternDisplayConfirmDeleteModal,
    };
  },
  components: {
    Title,
    DataTable,
    Column,
    ButtonCustom,
    ModalConfirm,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title content="Historique" subTitle="Relancez ou supprimez vos recherches sauvegardées" />

    <section class="overflow-x-auto">
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

        <Column field="createdAt" header="Date" style="width: 10%">
          <template #body="slotProps">
            <section class="flex items-center gap-8">
              <p>{{ new Date(slotProps.data.createdAt).toLocaleDateString('fr-FR') }}</p>
            </section>
          </template>
        </Column>
        <Column field="latitude" header="Latitude" style="width: 10%"></Column>
        <Column field="longitude" header="Longitude" style="width: 10%"></Column>
        <Column field="windSpeed10m" header="Vitesse du vent" style="width: 10%">
          <template #body="slotProps">
            <section class="flex items-center gap-8">
              <p>{{ slotProps.data.windSpeed10m }}</p>
            </section>
          </template>
        </Column>
        <Column field="windSpeedUnit" header="Unité du vent" style="width: 10%"></Column>
        <Column headerStyle="text-align: center" bodyStyle="text-align: center" style="width: 10%">
          <template #header>
            <div class="w-full text-center">Action</div>
          </template>
          <template #body="slotProps">
            <section class="flex justify-center items-center gap-2">
              <i
                @click="replaySearch(slotProps.data)"
                class="pi pi-pen-to-square cursor-pointer text-blue-600 hover:text-blue-800"
                title="Relancer"
              ></i>
              <i
                @click="alternDisplayConfirmDeleteModal(slotProps.data.id)"
                class="pi pi-trash cursor-pointer text-red-600 hover:text-red-800"
                title="Supprimer"
              ></i>
            </section>
          </template>
        </Column>
      </DataTable>
    </section>

    <!-- DELETE -->
    <ModalConfirm
      :visible="displayConfirmDeleteModal"
      @close="alternDisplayConfirmDeleteModal"
      @submit="deleteHistory"
      title="Supprimer cette recherche"
      submitLabel="Supprimer"
    >
      <template #content>
        <p>Etes vous sur de vouloir supprimer cette recherche ?</p>
      </template>
    </ModalConfirm>
  </article>
</template>
