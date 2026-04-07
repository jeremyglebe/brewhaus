<template>
  <div class="toast toast-bottom toast-end z-50">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="alert shadow-lg"
      :class="alertClassByType[toast.type]"
      role="status"
      aria-live="polite"
    >
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

export type ToastManagerRef = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

const DISMISS_MS = 2800;
let nextId = 1;

const toasts = ref<ToastItem[]>([]);

const alertClassByType: Record<ToastType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning',
};

function pushToast(type: ToastType, message: string): void {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return;
  }

  const id = nextId;
  nextId += 1;

  toasts.value = [...toasts.value, { id, message: trimmedMessage, type }];

  window.setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }, DISMISS_MS);
}

function success(message: string): void {
  pushToast('success', message);
}

function error(message: string): void {
  pushToast('error', message);
}

function info(message: string): void {
  pushToast('info', message);
}

function warning(message: string): void {
  pushToast('warning', message);
}

defineExpose<ToastManagerRef>({
  success,
  error,
  info,
  warning,
});
</script>
