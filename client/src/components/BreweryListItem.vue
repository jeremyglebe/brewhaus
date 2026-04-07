<template>
  <button
    type="button"
    class="card w-full overflow-hidden bg-base-100 text-left shadow-sm transition hover:shadow-md"
    @click="$emit('select', brewery.id)"
  >
    <figure class="relative bg-base-200">
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

    <div class="card-body">
      <h2 class="card-title text-lg">{{ brewery.name }}</h2>

      <p class="text-base-content/70">
        {{ brewery.city }}<span v-if="brewery.stateProvince">, {{ brewery.stateProvince }}</span>
      </p>

      <div class="card-actions justify-start">
        <div class="badge badge-outline">
          {{ brewery.breweryType || 'Unknown type' }}
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Brewery } from '@/types/graphql';

const imageLoading = ref(true)

// properties that can be passed to this component in the parent template
defineProps<{
  brewery: Brewery
}>()

// signals that can be listened to by the parent component when this component emits them
defineEmits<{
  (e: 'select', breweryId: string): void
}>()
</script>
