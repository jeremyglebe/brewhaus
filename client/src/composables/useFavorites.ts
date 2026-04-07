import { readonly, ref } from 'vue';
import {
  addFavorite as addFavoriteRecord,
  getFavorites,
  removeFavorite as removeFavoriteRecord,
  toggleFavorite as toggleFavoriteRecord,
  type FavoriteBrewery,
} from '@/services/favorites';
import { STORAGE_KEYS } from '@/services/storage/keys';

// Shared in-memory favorites state for the current browser tab.
// This is initialized from persisted storage once when the module is loaded.
const favorites = ref<FavoriteBrewery[]>(getFavorites());

// Guard to ensure the cross-tab storage listener is only registered once,
// even if useFavorites() is called by many components.
let storageSyncRegistered = false;

/**
 * Syncs the reactive favorites list with either:
 * - the provided next list (preferred after local mutations), or
 * - persisted storage (fallback / external refresh).
 */
function syncFavorites(nextFavorites = getFavorites()): FavoriteBrewery[] {
  favorites.value = nextFavorites;
  return favorites.value;
}

// Keep this tab in sync when another tab updates localStorage.
// Note: the 'storage' event does NOT fire in the same tab that wrote the value,
// which is why add/remove/toggle also call syncFavorites explicitly below.
if (typeof window !== 'undefined' && !storageSyncRegistered) {
  storageSyncRegistered = true;
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.favorites) {
      syncFavorites();
    }
  });
}

/**
 * Vue composable for favorites.
 *
 * Responsibility split:
 * - favorites service: persistence and domain operations (localStorage, records)
 * - this composable: reactive app-state bridge for Vue components
 *
 * Any component that calls useFavorites() receives the same shared state.
 */
export function useFavorites() {
  // Same-tab update: persist via service, then immediately sync reactive state.
  function addFavorite(favorite: FavoriteBrewery): FavoriteBrewery[] {
    return syncFavorites(addFavoriteRecord(favorite));
  }

  // Same-tab update: persist via service, then immediately sync reactive state.
  function removeFavorite(breweryId: string): FavoriteBrewery[] {
    return syncFavorites(removeFavoriteRecord(breweryId));
  }

  // Same-tab update: persist via service, then immediately sync reactive state.
  function toggleFavorite(favorite: FavoriteBrewery): FavoriteBrewery[] {
    return syncFavorites(toggleFavoriteRecord(favorite));
  }

  // Read from in-memory reactive state for fast UI checks.
  function isFavorite(breweryId: string): boolean {
    return favorites.value.some((favorite) => favorite.id === breweryId);
  }

  return {
    addFavorite,
    // readonly prevents accidental writes from components.
    favorites: readonly(favorites),
    isFavorite,
    removeFavorite,
    // Exposed for explicit refresh scenarios (e.g., debug/manual resync).
    syncFavorites,
    toggleFavorite,
  };
}
