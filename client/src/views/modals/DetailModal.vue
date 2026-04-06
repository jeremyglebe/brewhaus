<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-2xl">
      <!-- Close button -->
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
          ✕
        </button>
      </form>

      <!-- Content -->
      <BreweryDetailPage
        v-if="breweryId"
        :brewery-id="breweryId"
      />
    </div>

    <!-- Backdrop click closes dialog -->
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BreweryDetailPage from '@/views/pages/DetailPage.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Internal state (NOT props anymore)
const dialogRef = ref<HTMLDialogElement | null>(null)
const breweryId = ref<string | null>(null)

// Imperative API exposed to parent
function open(id: string): void {
  const dialog = dialogRef.value
  if (!dialog) return

  breweryId.value = id

  if (!dialog.open) {
    dialog.showModal()
  }
}

function close(): void {
  const dialog = dialogRef.value
  if (!dialog) return

  if (dialog.open) {
    dialog.close()
  }
}

// Emit close event when dialog closes (ANY reason)
function handleClose(): void {
  emit('close')
  breweryId.value = null
}

onMounted(() => {
  dialogRef.value?.addEventListener('close', handleClose)
})

onBeforeUnmount(() => {
  dialogRef.value?.removeEventListener('close', handleClose)
})

// Expose imperative API to parent
defineExpose({
  open,
  close,
})
</script>
