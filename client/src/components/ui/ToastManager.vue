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

// Severity variants mapped to daisyUI alert styles.
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Runtime item tracked in the in-memory queue.
type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

// Public imperative API exposed to parent refs.
// This enables centralized toast display while callers stay simple.
export type ToastManagerRef = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

// Keeps notifications short-lived and non-blocking.
const DISMISS_MS = 2800;

// Local incrementing id is sufficient because this queue is in-memory only.
let nextId = 1;

// Toast queue rendered by the template. New toasts are appended and stacked.
const toasts = ref<ToastItem[]>([]);

const alertClassByType: Record<ToastType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning',
};

// Adds a toast to the queue and schedules automatic removal.
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

// Convenience wrappers exposed through the ref API.
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

// This component is controlled imperatively from the app shell.
defineExpose<ToastManagerRef>({
  success,
  error,
  info,
  warning,
});
</script>
