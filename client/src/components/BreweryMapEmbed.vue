<template>
  <section v-if="embedUrl" class="space-y-3">
    <h3 class="text-sm font-semibold text-base-content/80">Map</h3>
    <iframe
      :src="embedUrl"
      class="h-72 w-full rounded-box border-0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
      :title="iframeTitle"
    ></iframe>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="btn btn-primary btn-sm"
        :disabled="gettingDirections"
        @click="onGetDirections"
      >
        <span v-if="gettingDirections" class="loading loading-spinner loading-xs"></span>
        <span>{{ gettingDirections ? 'Getting Directions...' : 'Get Directions' }}</span>
      </button>

      <button
        v-if="hasOrigin"
        type="button"
        class="btn btn-outline btn-sm"
        :disabled="gettingDirections"
        @click="onResetMap"
      >
        Show Map
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Geolocation } from '@capacitor/geolocation';
import { computed, ref } from 'vue';
import { useToast } from '@/composables/useToast';

const props = defineProps<{
  latitude?: number | null;
  longitude?: number | null;
}>();

const toast = useToast();
const originLatitude = ref<number | null>(null);
const originLongitude = ref<number | null>(null);
const gettingDirections = ref(false);

const hasDestination = computed(() => {
  return props.latitude != null && props.longitude != null;
});

const hasOrigin = computed(() => {
  return originLatitude.value != null && originLongitude.value != null;
});

const embedUrl = computed(() => {
  if (!hasDestination.value) {
    return null;
  }

  // The map intentionally uses a lightweight iframe embed rather than a full JS SDK.
  // That keeps the demo easy to run while still showing location and directions behavior.
  if (hasOrigin.value) {
    return `https://maps.google.com?saddr=${originLatitude.value},${originLongitude.value}&daddr=${props.latitude},${props.longitude}&output=embed`;
  }

  return `https://maps.google.com/maps?q=${props.latitude},${props.longitude}&z=14&output=embed`;
});

const iframeTitle = computed(() => {
  return hasOrigin.value ? 'Directions to brewery' : 'Brewery location map';
});

async function onGetDirections(): Promise<void> {
  if (!hasDestination.value || gettingDirections.value) {
    return;
  }

  gettingDirections.value = true;

  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    originLatitude.value = position.coords.latitude;
    originLongitude.value = position.coords.longitude;
    toast.success('Directions loaded from your current location');
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Unable to get your current location';

    toast.error(message);
  } finally {
    gettingDirections.value = false;
  }
}

function onResetMap(): void {
  originLatitude.value = null;
  originLongitude.value = null;
}
</script>
