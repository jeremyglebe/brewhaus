<template>
  <div v-if="loading" class="flex justify-center py-6">
    <span class="loading loading-infinity loading-md"></span>
  </div>

  <div v-else-if="errorMessage" class="alert alert-error shadow-sm">
    <span>{{ errorMessage }}</span>
  </div>

  <div v-else-if="brewery" class="space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold">{{ brewery.name }}</h2>
        <p class="text-base-content/70">
          {{ brewery.city }}<span v-if="brewery.stateProvince">, {{ brewery.stateProvince }}</span>
        </p>
      </div>

      <button
        type="button"
        class="btn btn-sm gap-2"
        :class="favoriteButtonClass"
        @click="onFavoriteToggle"
      >
        <HeartSolidIcon v-if="favorite" class="size-4" />
        <HeartOutlineIcon v-else class="size-4" />
        <span>{{ favorite ? 'Favorited' : 'Add Favorite' }}</span>
      </button>
    </div>

    <div class="space-y-2">
      <div v-if="brewery.breweryType" class="badge badge-outline">
        {{ brewery.breweryType }}
      </div>

      <p v-if="brewery.address1">{{ brewery.address1 }}</p>
      <p v-if="brewery.phone">{{ brewery.phone }}</p>

      <a v-if="brewery.websiteUrl" :href="brewery.websiteUrl" target="_blank" rel="noreferrer"
        class="link link-primary">
        Visit website
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline';
import fetchBreweryById from '@/services/brewery/fetchById';
import { useFavorites } from '@/composables/useFavorites';
import { createFavoriteBrewerySummary } from '@/services/favorites';
import type { gqlBrewery } from '@brewhaus/shared/types/graphql';
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  breweryId: string
}>()

const brewery = ref<gqlBrewery | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)
const { isFavorite, toggleFavorite } = useFavorites()

const favoriteSummary = computed(() => {
  if (!brewery.value) {
    return null
  }

  return createFavoriteBrewerySummary(brewery.value)
})

const favorite = computed(() => {
  if (!favoriteSummary.value) {
    return false
  }

  return isFavorite(favoriteSummary.value.id)
})

const favoriteButtonClass = computed(() => {
  return favorite.value ? 'btn-primary' : 'btn-outline'
})

async function loadBrewery(): Promise<void> {
  loading.value = true
  errorMessage.value = null

  try {
    brewery.value = await fetchBreweryById({ id: props.breweryId })
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

function onFavoriteToggle(): void {
  if (!favoriteSummary.value) {
    return
  }

  toggleFavorite(favoriteSummary.value)
}

onMounted(loadBrewery)
watch(() => props.breweryId, loadBrewery)
</script>
