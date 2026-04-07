<template>
  <div v-if="loading" class="space-y-4">
    <div class="skeleton h-52 w-full rounded-box"></div>
    <div class="space-y-2">
      <div class="skeleton h-6 w-2/3"></div>
      <div class="skeleton h-4 w-1/2"></div>
      <div class="skeleton h-4 w-3/4"></div>
    </div>
  </div>

  <div v-else-if="errorMessage" class="alert alert-error shadow-sm">
    <span>{{ errorMessage }}</span>
  </div>

  <div v-else-if="brewery" class="space-y-4">
    <figure class="relative overflow-hidden rounded-box bg-base-200">
      <div v-if="imageLoading" class="absolute inset-0 p-3">
        <div class="skeleton h-full w-full rounded-box"></div>
      </div>

      <img
        :src="brewery.imageUrl"
        :alt="`${brewery.name} photo`"
        class="aspect-4/3 w-full object-cover"
        loading="lazy"
        @load="imageLoading = false"
        @error="imageLoading = false"
      >
    </figure>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold">{{ brewery.name }}</h2>
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

    <div class="space-y-2 text-sm">
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

    <BreweryMapEmbed
      v-if="props.showMap"
      :latitude="brewery.latitude"
      :longitude="brewery.longitude"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { HeartIcon as HeartSolidIcon } from '@heroicons/vue/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline';
import fetchBreweryById from '@/services/brewery/fetchById';
import { useFavorites } from '@/composables/useFavorites';
import { useToast } from '@/composables/useToast';
import { createFavoriteBrewerySummary } from '@/services/favorites';
import type { Brewery } from '@/types/graphql';
import BreweryMapEmbed from '@/components/BreweryMapEmbed.vue';

const props = withDefaults(defineProps<{
  breweryId: string;
  showMap?: boolean
}>(), {
  showMap: false,
});

const brewery = ref<Brewery | null>(null);
const loading = ref(true);
const imageLoading = ref(true);
const errorMessage = ref<string | null>(null);
const { isFavorite, toggleFavorite } = useFavorites();
const toast = useToast();

// The favorites service stores a compact summary instead of the full GraphQL result.
// That keeps local persistence stable and avoids coupling storage to every UI field.
const favoriteSummary = computed(() => {
  if (!brewery.value) {
    return null;
  }

  return createFavoriteBrewerySummary(brewery.value);
});

const favorite = computed(() => {
  if (!favoriteSummary.value) {
    return false;
  }

  return isFavorite(favoriteSummary.value.id);
});

const favoriteButtonClass = computed(() => {
  return favorite.value ? 'btn-primary' : 'btn-outline';
});

async function loadBrewery(): Promise<void> {
  loading.value = true;
  imageLoading.value = true;
  errorMessage.value = null;

  try {
    brewery.value = await fetchBreweryById({ id: props.breweryId });
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unknown error';
  } finally {
    loading.value = false;
  }
}

function onFavoriteToggle(): void {
  if (!favoriteSummary.value) {
    return;
  }

  const wasFavorite = favorite.value;
  toggleFavorite(favoriteSummary.value);

  if (wasFavorite) {
    toast.info('Removed from favorites');
    return;
  }

  toast.success('Added to favorites');
}

onMounted(loadBrewery);

// The same component is reused in both modal and route contexts, so watch the id prop
// and reload when a different brewery is requested without remounting the parent shell.
watch(() => props.breweryId, loadBrewery);
</script>
