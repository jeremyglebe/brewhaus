<template>
  <!-- App shell: full-height page background -->
  <div class="min-h-screen bg-base-200">
    <!-- Navigation Bar header, visible on all pages.
      `sticky top-0`: remains visible (at the top) as the app scrolls
      `z-30`: ensures the navbar is above other content
    -->
    <header class="navbar bg-base-100 shadow-sm sticky top-0 z-30">
      <!-- Left side of navbar -->
      <div class="flex-1">
        <RouterLink to="/" class="btn btn-ghost text-xl">
          Brewhaus
        </RouterLink>
      </div>

      <!-- Right side of navbar -->
      <div class="flex-none">
        <span class="text-sm text-base-content/60">Mobile Demo</span>
      </div>
    </header>

    <!-- Main routed page content.
         pb-20 gives bottom padding so page content doesn't get hidden behind the dock. -->
    <main class="pb-20">
      <RouterView />
    </main>

    <!-- Bottom dock navigation -->
    <nav class="dock dock-sm">
      <RouterLink to="/" class="dock-item" :class="{ 'dock-active': isHomeActive }" aria-label="Home">
        <HomeIcon />
        <span class="dock-label">Home</span>
      </RouterLink>

      <RouterLink to="/search" class="dock-item" :class="{ 'dock-active': route.path === '/search' }"
        aria-label="Search">
        <MagnifyingGlassIcon />
        <span class="dock-label">Search</span>
      </RouterLink>

      <RouterLink to="/settings" class="dock-item" :class="{ 'dock-active': route.path === '/settings' }"
        aria-label="Settings">
        <Cog6ToothIcon />
        <span class="dock-label">Settings</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Cog6ToothIcon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/vue/16/solid';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const route = useRoute();
const isHomeActive = computed(() => {
  return route.path === '/' || route.path.startsWith('/list');
});
</script>
