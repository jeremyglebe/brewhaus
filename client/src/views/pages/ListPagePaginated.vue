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
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4">
            <div class="flex items-center justify-between text-sm text-base-content/70">
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <span>{{ totalCount }} result{{ totalCount === 1 ? '' : 's' }}</span>
            </div>

            <div class="mt-3 flex justify-center">
              <div class="join">
                <button
                  type="button"
                  class="join-item btn btn-sm"
                  :class="{ 'btn-disabled': currentPage <= 1 }"
                  :disabled="currentPage <= 1 || pageLoading"
                  @click="goToPage(currentPage - 1)"
                >
                  Prev
                </button>

                <button
                  v-for="item in paginationItems"
                  :key="`top-${item.key}`"
                  type="button"
                  class="join-item btn btn-sm"
                  :class="{
                    'btn-active': item.type === 'page' && item.value === currentPage,
                    'text-base font-semibold': item.type === 'page' && item.value === currentPage,
                  }"
                  :disabled="pageLoading || item.type === 'ellipsis'"
                  @click="item.type === 'page' ? goToPage(item.value) : undefined"
                >
                  {{ item.label }}
                </button>

                <button
                  type="button"
                  class="join-item btn btn-sm"
                  :class="{ 'btn-disabled': currentPage >= totalPages }"
                  :disabled="currentPage >= totalPages || pageLoading"
                  @click="goToPage(currentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>

            <div v-if="pageLoading" class="mt-3 flex justify-center">
              <span class="loading loading-infinity loading-md"></span>
            </div>
          </div>
        </div>

        <div
          v-for="brewery in breweries"
          :key="brewery.id"
          class="card bg-base-100 shadow-sm"
        >
          <BreweryListItem :brewery="brewery" @select="onListItemSelected" />
        </div>

        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4">
            <div class="flex items-center justify-between text-sm text-base-content/70">
              <span>Page {{ currentPage }} of {{ totalPages }}</span>
              <span>{{ totalCount }} result{{ totalCount === 1 ? '' : 's' }}</span>
            </div>

            <div class="mt-3 flex justify-center">
              <div class="join">
                <button
                  type="button"
                  class="join-item btn btn-sm"
                  :class="{ 'btn-disabled': currentPage <= 1 }"
                  :disabled="currentPage <= 1 || pageLoading"
                  @click="goToPage(currentPage - 1)"
                >
                  Prev
                </button>

                <button
                  v-for="item in paginationItems"
                  :key="item.key"
                  type="button"
                  class="join-item btn btn-sm"
                  :class="{
                    'btn-active': item.type === 'page' && item.value === currentPage,
                    'text-base font-semibold': item.type === 'page' && item.value === currentPage,
                  }"
                  :disabled="pageLoading || item.type === 'ellipsis'"
                  @click="item.type === 'page' ? goToPage(item.value) : undefined"
                >
                  {{ item.label }}
                </button>

                <button
                  type="button"
                  class="join-item btn btn-sm"
                  :class="{ 'btn-disabled': currentPage >= totalPages }"
                  :disabled="currentPage >= totalPages || pageLoading"
                  @click="goToPage(currentPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>

            <div v-if="pageLoading" class="mt-3 flex justify-center">
              <span class="loading loading-infinity loading-md"></span>
            </div>
          </div>
        </div>

        <div v-if="breweries.length === 0" class="alert shadow-sm">
          <span>No breweries found for the selected filters.</span>
        </div>

        <DetailModal ref="modalRef" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import BreweryListItem from '@/components/BreweryListItem.vue';
import BreweryFilters from '@/components/BreweryFilters.vue';
import DetailModal from '../modals/DetailModal.vue';
import type { gqlBrewery, gqlBreweryListFilters } from '@brewhaus/shared/types/graphql';
import fetchAllBreweries from '@/services/brewery/fetchAll';
import fetchBreweriesMeta from '@/services/brewery/fetchMeta';

const PER_PAGE = 12;

type PaginationItem =
  | { type: 'page'; value: number; label: string; key: string }
  | { type: 'ellipsis'; label: string; key: string };

const breweries = ref<gqlBrewery[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalCount = ref(0);
const activeFilters = ref<gqlBreweryListFilters | null>(null);

const initialLoading = ref(true);
const pageLoading = ref(false);
const errorMessage = ref<string | null>(null);

const modal = useTemplateRef('modalRef');

const paginationItems = computed<PaginationItem[]>(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => {
      const pageNumber = i + 1;
      return {
        type: 'page' as const,
        value: pageNumber,
        label: String(pageNumber),
        key: `page-${pageNumber}`,
      };
    });
  }

  if (current <= 2) {
    return [
      { type: 'page', value: 1, label: '1', key: 'page-1' },
      { type: 'page', value: 2, label: '2', key: 'page-2' },
      { type: 'page', value: 3, label: '3', key: 'page-3' },
      { type: 'ellipsis', label: '...', key: 'ellipsis-right' },
      { type: 'page', value: total, label: String(total), key: `page-${total}` },
    ];
  }

  if (current >= total - 1) {
    return [
      { type: 'page', value: 1, label: '1', key: 'page-1' },
      { type: 'ellipsis', label: '...', key: 'ellipsis-left' },
      { type: 'page', value: total - 2, label: String(total - 2), key: `page-${total - 2}` },
      { type: 'page', value: total - 1, label: String(total - 1), key: `page-${total - 1}` },
      { type: 'page', value: total, label: String(total), key: `page-${total}` },
    ];
  }

  return [
    { type: 'page', value: 1, label: '1', key: 'page-1' },
    { type: 'ellipsis', label: '...', key: 'ellipsis-left' },
    { type: 'page', value: current - 1, label: String(current - 1), key: `page-${current - 1}` },
    { type: 'page', value: current, label: String(current), key: `page-${current}` },
    { type: 'page', value: current + 1, label: String(current + 1), key: `page-${current + 1}` },
    { type: 'ellipsis', label: '...', key: 'ellipsis-right' },
    { type: 'page', value: total, label: String(total), key: `page-${total}` },
  ];
});

async function refreshMetaAndPage(page: number): Promise<void> {
  pageLoading.value = true;
  errorMessage.value = null;

  try {
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

function onListItemSelected(breweryId: string): void {
  modal.value?.open(breweryId);
}

function onFiltersApply(filters: gqlBreweryListFilters): void {
  activeFilters.value = filters;
  void refreshMetaAndPage(1);
}

function onFiltersClear(): void {
  activeFilters.value = null;
  void refreshMetaAndPage(1);
}

void refreshMetaAndPage(1);
</script>
