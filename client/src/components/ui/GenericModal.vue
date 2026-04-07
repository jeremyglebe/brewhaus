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

type ModalPayload = Record<string, unknown> | null;

export type GenericModalRef = {
  open: (data?: ModalPayload) => void;
  close: () => void;
};

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

const dialogRef = ref<HTMLDialogElement | null>(null);
const payload = ref<ModalPayload>(null);

function open(data: ModalPayload = null): void {
  payload.value = data;

  if (!dialogRef.value?.open) {
    dialogRef.value?.showModal();
  }
}

function close(): void {
  if (dialogRef.value?.open) {
    dialogRef.value.close();
  }
}

function onClose(): void {
  payload.value = null;
  emit('close');
}

defineExpose<GenericModalRef>({
  open,
  close,
});
</script>
