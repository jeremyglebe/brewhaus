<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <div class="flex items-center justify-between text-sm text-base-content/70">
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <span>{{ totalCount }} result{{ totalCount === 1 ? '' : 's' }}</span>
      </div>

      <div class="mt-3 flex justify-center">
        <div class="join">
          <button
            type="button"
            class="join-item btn btn-sm"
            :class="{ 'btn-disabled': currentPage <= 1 }"
            :disabled="currentPage <= 1 || loading"
            @click="emit('navigate', currentPage - 1)"
          >
            Prev
          </button>

          <button
            v-for="item in paginationItems"
            :key="item.key"
            type="button"
            class="join-item btn btn-sm"
            :class="{
              'btn-active': item.type === 'page' && item.value === currentPage,
              'text-base font-semibold': item.type === 'page' && item.value === currentPage,
            }"
            :disabled="loading || item.type === 'ellipsis'"
            @click="item.type === 'page' ? emit('navigate', item.value) : undefined"
          >
            {{ item.label }}
          </button>

          <button
            type="button"
            class="join-item btn btn-sm"
            :class="{ 'btn-disabled': currentPage >= totalPages }"
            :disabled="currentPage >= totalPages || loading"
            @click="emit('navigate', currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>

      <div v-if="loading" class="mt-3 flex justify-center">
        <span class="loading loading-infinity loading-md"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Render model used by page buttons and ellipsis placeholders.
type PaginationItem =
  | { type: 'page'; value: number; label: string; key: string }
  | { type: 'ellipsis'; label: string; key: string };

// Reusable pagination UI for list pages.
// This component only renders controls and emits requested page changes.
const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
}>();

// Parent page owns the data fetching and decides whether to honor navigation.
const emit = defineEmits<{
  (e: 'navigate', page: number): void;
}>();

// Keeps visible buttons compact while still allowing jumps to first/last pages.
const paginationItems = computed<PaginationItem[]>(() => {
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => {
      const pageNumber = i + 1;
      return {
        type: 'page' as const,
        value: pageNumber,
        label: String(pageNumber),
        key: `page-${pageNumber}`,
      };
    });
  }

  if (current <= 2) {
    return [
      { type: 'page', value: 1, label: '1', key: 'page-1' },
      { type: 'page', value: 2, label: '2', key: 'page-2' },
      { type: 'page', value: 3, label: '3', key: 'page-3' },
      { type: 'ellipsis', label: '...', key: 'ellipsis-right' },
      { type: 'page', value: total, label: String(total), key: `page-${total}` },
    ];
  }

  if (current >= total - 1) {
    return [
      { type: 'page', value: 1, label: '1', key: 'page-1' },
      { type: 'ellipsis', label: '...', key: 'ellipsis-left' },
      { type: 'page', value: total - 2, label: String(total - 2), key: `page-${total - 2}` },
      { type: 'page', value: total - 1, label: String(total - 1), key: `page-${total - 1}` },
      { type: 'page', value: total, label: String(total), key: `page-${total}` },
    ];
  }

  return [
    { type: 'page', value: 1, label: '1', key: 'page-1' },
    { type: 'ellipsis', label: '...', key: 'ellipsis-left' },
    { type: 'page', value: current - 1, label: String(current - 1), key: `page-${current - 1}` },
    { type: 'page', value: current, label: String(current), key: `page-${current}` },
    { type: 'page', value: current + 1, label: String(current + 1), key: `page-${current + 1}` },
    { type: 'ellipsis', label: '...', key: 'ellipsis-right' },
    { type: 'page', value: total, label: String(total), key: `page-${total}` },
  ];
});
</script>
