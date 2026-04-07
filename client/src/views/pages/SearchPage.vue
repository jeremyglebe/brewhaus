<template>
  <main class="min-h-screen bg-base-200">
    <section class="container mx-auto max-w-2xl p-4 space-y-4">
      <!-- Page header -->
      <div class="navbar rounded-box bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">Search Breweries</h1>
        </div>
      </div>

      <!-- Search form
        .prevent modifier on submit to prevent page reload and handle it with Vue instead
        equivalent to event.preventDefault() in vanilla JS
      -->
      <form class="card bg-base-100 shadow-sm" @submit.prevent="submitSearch">
        <div class="card-body space-y-4">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Brewery name</span>
            </div>

            <input v-model="searchInput" type="text" placeholder="Search breweries..."
              class="input input-bordered w-full" />
          </label>

          <div class="card-actions justify-end">
            <button class="btn btn-primary" type="submit" :disabled="loading">
              <span v-if="loading" class="loading loading-infinity loading-sm"></span>
              <span v-else>Search</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Initial guidance -->
      <div v-if="!hasSearched && !loading && !errorMessage" class="alert bg-base-100 shadow-sm">
        <span>Enter a brewery name and search.</span>
      </div>

      <!-- Error state -->
      <div v-else-if="errorMessage" class="alert alert-error shadow-sm">
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="hasSearched && !loading && breweries.length === 0" class="alert bg-base-100 shadow-sm">
        <span>No breweries found.</span>
      </div>

      <!-- Results -->
      <div v-else-if="breweries.length > 0" class="space-y-4">
        <div v-for="brewery in breweries" :key="brewery.id" class="card bg-base-100 shadow-sm">
          <BreweryListItem :brewery="brewery" @select="onListItemSelected" />
        </div>

        <DetailModal ref="modalRef" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import BreweryListItem from '@/components/BreweryListItem.vue'
import DetailModal from '../modals/DetailModal.vue'
import type { Brewery } from '@/types/graphql'
import fetchBreweriesBySearch from '@/services/brewery/fetchBySearch'

const searchInput = ref('')
const breweries = ref<Brewery[]>([])

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const hasSearched = ref(false)
const modal = useTemplateRef('modalRef')

async function submitSearch(): Promise<void> {
  const trimmedSearch = searchInput.value.trim()

  if (!trimmedSearch) {
    breweries.value = []
    hasSearched.value = false
    errorMessage.value = null
    return
  }

  loading.value = true
  errorMessage.value = null
  hasSearched.value = true

  try {
    const result = await fetchBreweriesBySearch({
      query: trimmedSearch,
    })

    breweries.value = result.items
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

function onListItemSelected(breweryId: string): void {
  modal.value?.open(breweryId)
}
</script>
