<template>
  <div v-if="loading" class="flex justify-center py-6">
    <span class="loading loading-infinity loading-md"></span>
  </div>

  <div v-else-if="errorMessage" class="alert alert-error shadow-sm">
    <span>{{ errorMessage }}</span>
  </div>

  <div v-else-if="brewery" class="space-y-4">
    <div>
      <h2 class="text-2xl font-bold">{{ brewery.name }}</h2>
      <p class="text-base-content/70">
        {{ brewery.city }}<span v-if="brewery.stateProvince">, {{ brewery.stateProvince }}</span>
      </p>
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
import fetchBreweryById from '@/services/brewery/fetchById';
import type { gqlBrewery } from '@brewhaus/shared/types/graphql';
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  breweryId: string
}>()

const brewery = ref<gqlBrewery | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

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

onMounted(loadBrewery)
watch(() => props.breweryId, loadBrewery)
</script>
