<template>
  <dialog ref="dialogRef" class="modal" @close="onClose">
    <div class="modal-box p-0" :class="boxClass">
      <div class="flex items-center justify-between border-b border-base-300 px-4 py-3">
        <h3 class="text-lg font-semibold">{{ title }}</h3>

        <button type="button" class="btn btn-ghost btn-sm btn-circle" aria-label="Close modal" @click="close">
          ✕
        </button>
      </div>

      <div class="p-4">
        <slot :data="payload" />
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Lightweight payload channel passed from open(data) to slot content.
type ModalPayload = Record<string, unknown> | null;

// Public imperative API for opening/closing the native dialog.
export type GenericModalRef = {
  open: (data?: ModalPayload) => void;
  close: () => void;
};

// title/boxClass let callers keep a shared shell while adjusting context and size.
withDefaults(
  defineProps<{
    title?: string;
    boxClass?: string;
  }>(),
  {
    title: 'Details',
    boxClass: 'max-w-2xl',
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// Underlying native dialog element.
const dialogRef = ref<HTMLDialogElement | null>(null);

// Payload is forwarded to slot content via #default="{ data }".
const payload = ref<ModalPayload>(null);

// Opens the modal and stores caller-provided payload for the slot.
function open(data: ModalPayload = null): void {
  payload.value = data;

  if (!dialogRef.value?.open) {
    dialogRef.value?.showModal();
  }
}

// Programmatic close for parent flows.
function close(): void {
  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
}

// Reset payload after close so stale data does not leak across opens.
function onClose(): void {
  payload.value = null;
  emit('close');
}

// Exposes imperative API to refs in parent pages.
defineExpose<GenericModalRef>({
  open,
  close,
});
</script>
