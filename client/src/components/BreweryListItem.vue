<template>
  <button type="button" class="card w-full bg-base-100 text-left shadow-sm transition hover:shadow-md"
    @click="$emit('select', brewery.id)">
    <div class="card-body">
      <h2 class="card-title">{{ brewery.name }}</h2>

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
import type { BreweryResultItem } from '@/types/brewery'

// properties that can be passed to this component in the parent template
defineProps<{
  brewery: BreweryResultItem
}>()

// signals that can be listened to by the parent component when this component emits them
defineEmits<{
  (e: 'select', breweryId: string): void
}>()
</script>
