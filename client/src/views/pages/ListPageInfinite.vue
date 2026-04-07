<template>
  <!-- Full-page wrapper. bg-base-200 is daisyUI's page background -->
  <main class="min-h-screen bg-base-200">
    <!-- Centered content column with mobile padding. -->
    <section class="container mx-auto max-w-2xl p-4">
      <!-- Hero-style page header. -->
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

      <!-- Compact filter panel above the list. -->
      <BreweryFilters @apply="onFiltersApply" @clear="onFiltersClear" />

      <!-- Initial loading state for the first page only. -->
      <div v-if="initialLoading" class="alert alert-info shadow-sm">
        <span>Loading breweries...</span>
      </div>

      <!-- Error state. -->
      <div v-else-if="errorMessage" class="alert alert-error shadow-sm">
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Main result list. -->
      <div v-else class="space-y-4">
        <div v-for="brewery in breweries" :key="brewery.id" class="card bg-base-100 shadow-sm">

          <!-- Component-based card -->
          <BreweryListItem :brewery="brewery" @select="onListItemSelected"></BreweryListItem>

        </div>

        <DetailModal ref="modalRef" />

        <!-- Sentinel observed by IntersectionObserver.
             When it enters the viewport, the app attempts to load the next page. -->
        <div ref="sentinel" class="py-4">
          <div v-if="loadingMore" class="flex justify-center">
            <span class="loading loading-infinity loading-xl"></span>
          </div>

          <div v-else-if="!hasNextPage" class="text-center text-sm text-base-content/60">
            You've reached the end.
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import BreweryListItem from '@/components/BreweryListItem.vue';
import BreweryFilters from '@/components/BreweryFilters.vue';
import DetailModal from '../modals/DetailModal.vue';
import type { Brewery, BreweryListFilters } from '@/types/graphql';
import fetchAllBreweries from '@/services/brewery/fetchAll';

// Configuration
const PER_PAGE = 12;

// Reactive data state
const breweries = ref<Brewery[]>([]);
const page = ref(1);
const hasNextPage = ref(true);

// Active filters — null means no filters are applied (default unfiltered list).
const activeFilters = ref<BreweryListFilters | null>(null);

// Reactive loading state
const initialLoading = ref(true);
const loadingMore = ref(false);
const errorMessage = ref<string | null>(null);

// Modal reference for opening/closing the brewery detail modal from the list page
const modal = useTemplateRef('modalRef');

// Sentinel element marking the end of the page, the observer triggers when it enters the viewport
const sentinelElement = useTemplateRef('sentinel');
// Observer which will trigger loading the next page when the sentinel enters the viewport
let observer: IntersectionObserver | null = null;

/**
 * Loads the first page of content- this is separate to handle the
 * initial loading state and error handling differently from subsequent pages.
 */
async function loadFirstPage(): Promise<void> {
  // Reset the state in case this is called again for any reason (e.g. retry after error)
  initialLoading.value = true;
  errorMessage.value = null;

  try {
    // Use the brewery service to fetch the first page
    const result = await fetchAllBreweries({
      page: 1,
      perPage: PER_PAGE,
      filters: activeFilters.value,
    });

    // Update the data state
    breweries.value = result.items;
    page.value = result.page;
    hasNextPage.value = result.hasNextPage;

  } catch (error) {
    // Display any errors that occur during the fetch
    errorMessage.value =
      error instanceof Error ? error.message : 'Unknown error';
  } finally {
    // Update the loading state to hide the page startup loading indicator
    initialLoading.value = false;
  }
}

/**
 * Loads additional pages of content when the user scrolls to the bottom.
 */
async function loadNextPage(): Promise<void> {
  // Do not attempt to load if:
  // - The initial page is still loading
  // - A page is already loading (prevents multiple simultaneous loads)
  // - There are no more pages to load
  if (initialLoading.value || loadingMore.value || !hasNextPage.value) {
    return;
  }

  // Set the loading state to show the loading indicator in the UI
  loadingMore.value = true;

  try {
    const nextPage = page.value + 1;

    // Brewery service fetches the page
    const result = await fetchAllBreweries({
      page: nextPage,
      perPage: PER_PAGE,
      filters: activeFilters.value,
    });

    // Update the data state by appending the new items and updating the page
    breweries.value = [...breweries.value, ...result.items];
    page.value = result.page;
    hasNextPage.value = result.hasNextPage;

  } catch (error) {
    // Display any errors that occur during the fetch
    errorMessage.value =
      error instanceof Error ? error.message : 'Unknown error';
  } finally {
    // Update the loading state to hide the loading indicator

    loadingMore.value = false;
  }
}

// The sentinel lives inside v-else, so it unmounts while initialLoading is true and
// gets a new DOM node when loading finishes
// watching the ref reconnects the observer to the new element automatically each time.
watch(sentinelElement, (el) => {
  // Disconnect any existing observer before potentially creating a new one.
  observer?.disconnect();

  if (!el) return;

  // IntersectionObserver specifically watches for changes in the intersection of the
  // targeted element and an ancestor (or the viewport by default).
  // The root would be specified in the constructor, while the target element is observed via the observe() method.
  // (There can be multiple targets for a single observer, but each observer will share the same root and options.)
  // The app checks against the viewport, so a root is not specified.
  observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    // Get the first entry which has changed intersection status.
    // There should only be one since the app only observes one element. There could be multiple
    // if the app was watching multiple sentinel elements, which is why the callback provides an array.
    const entry = entries[0];

    // Check if the entry is currently intersecting the viewport (this method will trigger every time the
    // intersection status changes, but the app should only load more when it is IN FRAME, not when it leaves)
    if (entry?.isIntersecting) {
      void loadNextPage();
    }
  });

  // Start watching the end of page sentinel
  observer.observe(el);
});

function onListItemSelected(breweryId: string): void {
  modal.value?.open(breweryId);
}

// Applying filters resets the list to page 1 with the new filter set active.
function onFiltersApply(filters: BreweryListFilters): void {
  activeFilters.value = filters;
  void loadFirstPage();
}

// Clearing filters resets to the default unfiltered list.
function onFiltersClear(): void {
  activeFilters.value = null;
  void loadFirstPage();
}

// lifecyle hook that runs when the user enters the page
// handles the initial loading and setup
onMounted(async () => {
  await loadFirstPage();
});

// lifecycle hook that runs when the user leaves the page
// kills observers or other ongoing processes before exiting
onBeforeUnmount(() => {
  observer?.disconnect();
});

</script>
