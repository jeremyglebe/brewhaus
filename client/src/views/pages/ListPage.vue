<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getListModePreference, resolveListModeRoute } from '@/services/preferences';

const router = useRouter();

onMounted(() => {
  // `/` acts as a preference-aware landing route rather than owning a full list implementation.
  const preferredMode = getListModePreference();
  const targetRoute = resolveListModeRoute(preferredMode);

  void router.replace(targetRoute);
});
</script>

<template>
  <main class="min-h-screen bg-base-200">
    <section class="container mx-auto max-w-2xl p-4">
      <div class="hero rounded-box bg-base-100 shadow-sm">
        <div class="hero-content text-center">
          <div>
            <h1 class="text-xl font-semibold">Opening your brewery list...</h1>
            <span class="loading loading-dots loading-md mt-3"></span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
