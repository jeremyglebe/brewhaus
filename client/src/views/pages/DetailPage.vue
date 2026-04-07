<template>
  <main class="min-h-screen bg-base-200">
    <section class="container mx-auto max-w-2xl p-4">
      <div class="hero mb-4 rounded-box bg-base-100 shadow-sm">
        <div class="hero-content w-full justify-between">
          <h1 class="text-xl font-bold">Brewery Details</h1>
          <RouterLink to="/" class="btn btn-ghost btn-sm">
            ← Back
          </RouterLink>
        </div>
      </div>

      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <BreweryDetails v-if="breweryId" :brewery-id="breweryId" />
          <div v-else class="alert alert-error">
            <span>Missing brewery id.</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BreweryDetails from '../../components/BreweryDetails.vue'

const route = useRoute()

const breweryId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : null
})
</script>
