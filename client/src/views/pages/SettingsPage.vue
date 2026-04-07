<template>
  <main class="container mx-auto max-w-2xl p-4">
    <div class="hero mb-6 rounded-box bg-base-100 shadow-sm">
      <div class="hero-content text-center">
        <div>
          <h1 class="text-2xl font-bold">Settings</h1>
          <p class="text-base-content/70">Choose how the brewery list behaves on Home.</p>
        </div>
      </div>
    </div>

    <section class="card bg-base-100 shadow-sm">
      <div class="card-body gap-4">
        <h2 class="card-title text-lg">Brewery List Mode</h2>
        <p class="text-sm text-base-content/70">
          This preference controls which experience opens when you tap Home.
        </p>

        <div class="join join-vertical w-full" role="radiogroup" aria-label="Brewery list mode">
          <label class="join-item btn justify-start gap-3 text-left" :class="selectedMode === 'infinite' ? 'btn-primary' : 'btn-outline'">
            <input
              v-model="selectedMode"
              type="radio"
              name="list-mode"
              class="radio radio-sm"
              value="infinite"
              @change="onModeChange"
            >
            <span>
              <span class="block font-semibold">Infinite Scroll</span>
              <span class="block text-xs opacity-80">Load more breweries as you scroll.</span>
            </span>
          </label>

          <label class="join-item btn justify-start gap-3 text-left" :class="selectedMode === 'pagination' ? 'btn-primary' : 'btn-outline'">
            <input
              v-model="selectedMode"
              type="radio"
              name="list-mode"
              class="radio radio-sm"
              value="pagination"
              @change="onModeChange"
            >
            <span>
              <span class="block font-semibold">Pagination</span>
              <span class="block text-xs opacity-80">Move through breweries page by page.</span>
            </span>
          </label>
        </div>

        <p class="text-xs text-base-content/60">
          Saved locally on this device and browser.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BreweryListMode } from '@/services/preferences';
import { getListModePreference, setListModePreference } from '@/services/preferences';

const selectedMode = ref<BreweryListMode>(getListModePreference());

function onModeChange(): void {
  setListModePreference(selectedMode.value);
}
</script>
