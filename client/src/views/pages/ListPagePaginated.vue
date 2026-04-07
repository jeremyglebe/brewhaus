<template>
  <main class="min-h-screen bg-base-200">
    <section class="container mx-auto max-w-2xl p-4">
      <div class="hero mb-6 rounded-box bg-base-100 shadow-sm">
        <div class="hero-content w-full justify-start">
          <div>
            <h1 class="text-3xl font-bold">Brewhaus</h1>
            <p class="text-base-content/70">
              Browse breweries from the Brewhaus directory.
            </p>
          </div>
        </div>
      </div>

      <BreweryFilters @apply="onFiltersApply" @clear="onFiltersClear" />

      <div v-if="initialLoading" class="alert alert-info shadow-sm">
        <span>Loading breweries...</span>
      </div>

      <div v-else-if="errorMessage" class="alert alert-error shadow-sm">
        <span>{{ errorMessage }}</span>
      </div>

      <div v-else class="space-y-4">
        <PaginationControls
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-count="totalCount"
          :loading="pageLoading"
          @navigate="onNavigate"
        />

        <BreweryListItem
          v-for="brewery in breweries"
          :key="brewery.id"
          :brewery="brewery"
          @select="onListItemSelected"
        />

        <PaginationControls
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-count="totalCount"
          :loading="pageLoading"
          @navigate="onNavigate"
        />

        <div v-if="breweries.length === 0" class="alert shadow-sm">
          <span>No breweries found for the selected filters.</span>
        </div>

        <GenericModal ref="modalRef" title="Brewery details" box-class="max-w-3xl">
          <template #default="{ data }">
            <div class="space-y-4">
              <BreweryDetails v-if="data?.breweryId" :brewery-id="String(data.breweryId)" />
              <RouterLink
                v-if="data?.breweryId"
                :to="`/brewery/${String(data.breweryId)}`"
                class="btn btn-outline btn-sm"
              >
                Open full page
              </RouterLink>
            </div>
          </template>
        </GenericModal>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { RouterLink } from 'vue-router';
import BreweryListItem from '@/components/BreweryListItem.vue';
import BreweryFilters from '@/components/BreweryFilters.vue';
import BreweryDetails from '@/components/BreweryDetails.vue';
import GenericModal from '@/components/ui/GenericModal.vue';
import PaginationControls from '@/components/ui/PaginationControls.vue';
import type { Brewery, BreweryListFilters } from '@/types/graphql';
import fetchAllBreweries from '@/services/brewery/fetchAll';
import fetchBreweriesMeta from '@/services/brewery/fetchMeta';

// Paginated mode fetches the list and metadata together so the page controls can stay accurate.
const PER_PAGE = 12;

const breweries = ref<Brewery[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalCount = ref(0);
const activeFilters = ref<BreweryListFilters | null>(null);

const initialLoading = ref(true);
const pageLoading = ref(false);
const errorMessage = ref<string | null>(null);

const detailModalRef = useTemplateRef('modalRef');

async function refreshMetaAndPage(page: number): Promise<void> {
  pageLoading.value = true;
  errorMessage.value = null;

  try {
    // Metadata and page items come from separate GraphQL queries because they drive
    // different UI needs in the paginated experience.
    const [metaResult, listResult] = await Promise.all([
      fetchBreweriesMeta({
        page,
        perPage: PER_PAGE,
        filters: activeFilters.value,
      }),
      fetchAllBreweries({
        page,
        perPage: PER_PAGE,
        filters: activeFilters.value,
      }),
    ]);

    totalPages.value = Math.max(1, metaResult.totalPages);
    totalCount.value = Math.max(0, metaResult.total);
    currentPage.value = Math.min(page, totalPages.value);
    breweries.value = listResult.items;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unknown error';
  } finally {
    pageLoading.value = false;
    initialLoading.value = false;
  }
}

async function goToPage(page: number): Promise<void> {
  if (pageLoading.value) {
    return;
  }

  if (page < 1 || page > totalPages.value) {
    return;
  }

  await refreshMetaAndPage(page);
}

function onNavigate(page: number): void {
  void goToPage(page);
}

function onListItemSelected(breweryId: string): void {
  detailModalRef.value?.open({ breweryId });
}

function onFiltersApply(filters: BreweryListFilters): void {
  activeFilters.value = filters;
  void refreshMetaAndPage(1);
}

function onFiltersClear(): void {
  activeFilters.value = null;
  void refreshMetaAndPage(1);
}

void refreshMetaAndPage(1);
</script>
