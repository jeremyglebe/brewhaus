<template>
  <section v-if="embedUrl" class="space-y-2">
    <h3 class="text-sm font-semibold text-base-content/80">Map</h3>
    <iframe
      :src="embedUrl"
      class="h-72 w-full rounded-box border-0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
      title="Brewery location map"
    ></iframe>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  latitude?: number | null;
  longitude?: number | null;
}>();

const embedUrl = computed(() => {
  if (props.latitude == null || props.longitude == null) {
    return null;
  }

  return `https://maps.google.com/maps?q=${props.latitude},${props.longitude}&z=14&output=embed`;
});
</script>
