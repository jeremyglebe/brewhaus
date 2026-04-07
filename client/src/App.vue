<template>
  <div class="drawer drawer-end">
    <input id="favorites-drawer" v-model="drawerOpen" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex min-h-screen flex-col bg-base-200">
      <header class="navbar sticky top-0 z-30 bg-base-100 shadow-sm">
        <div class="flex-1">
          <RouterLink to="/" class="btn btn-ghost text-xl">
            <img :src="beerMugSvg" alt="Beer mug" class="beer-mug-mark" />
            <span>Brewhaus</span>
          </RouterLink>
        </div>

        <div class="flex-none items-center gap-2">
          <span class="hidden text-sm text-base-content/60 sm:inline">Mobile Demo</span>

          <button type="button" class="btn btn-ghost btn-sm gap-2" @click="drawerOpen = true">
            <HeartIcon class="size-4" />
            <span>Favorites</span>
            <span class="badge badge-sm badge-outline">{{ favorites.length }}</span>
          </button>
        </div>
      </header>

      <div class="flex-1 pb-20">
        <RouterView />
      </div>

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

      <ToastManager ref="toastManagerRef" />
    </div>

    <div class="drawer-side z-40">
      <label for="favorites-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

      <aside class="flex min-h-full w-80 max-w-full flex-col bg-base-100">
        <div class="border-b border-base-300 px-4 py-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-lg font-semibold">Favorites</p>
              <p class="text-sm text-base-content/60">Saved breweries on this device.</p>
            </div>

            <button type="button" class="btn btn-ghost btn-sm btn-circle" @click="drawerOpen = false">
              ✕
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="favorites.length === 0" class="alert shadow-sm">
            <img :src="beerMugSvg" alt="Beer mug" class="empty-mug-icon" />
            <span>Your mug is empty. Favorite a brewery from any detail view and it will show up here.</span>
          </div>

          <ul v-else class="menu w-full gap-2 rounded-box bg-base-100 p-0">
            <li v-for="favorite in favorites" :key="favorite.id">
              <RouterLink :to="`/brewery/${favorite.id}`" class="rounded-box border border-base-300 px-3 py-3" @click="closeDrawer">
                <span class="font-medium">{{ favorite.name }}</span>
                <span class="text-xs text-base-content/60">{{ formatFavoriteLocation(favorite) }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { Cog6ToothIcon, HeartIcon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/vue/16/solid';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useFavorites } from '@/composables/useFavorites';
import ToastManager from '@/components/ui/ToastManager.vue';
import type { FavoriteBrewery } from '@/services/favorites';
import { setToastManager } from '@/composables/useToast';
import beerMugSvg from '@/assets/beer-mug.svg';

const route = useRoute();
const drawerOpen = ref(false);
const { favorites } = useFavorites();
const toastManagerRef = useTemplateRef('toastManagerRef');

const isHomeActive = computed(() => {
  return route.path === '/' || route.path.startsWith('/list');
});

function closeDrawer(): void {
  drawerOpen.value = false;
}

function formatFavoriteLocation(favorite: FavoriteBrewery): string {
  const location = [favorite.city, favorite.stateProvince].filter(Boolean).join(', ');

  return location || 'Location unavailable';
}

watch(() => route.fullPath, closeDrawer);
watch(toastManagerRef, (manager) => {
  setToastManager(manager ?? null);
}, { immediate: true });
</script>

<style scoped>
.beer-mug-mark {
  height: 1.25rem;
  width: 1.25rem;
  animation: mug-bob 2.4s ease-in-out infinite;
}

.empty-mug-icon {
  height: 1.5rem;
  width: 1.5rem;
  opacity: 0.85;
}

@keyframes mug-bob {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-1.5px);
  }
}
</style>
