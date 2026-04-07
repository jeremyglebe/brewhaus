import { ref } from 'vue';
import type { ToastManagerRef } from '@/components/ui/ToastManager.vue';

// Shared singleton ref to the mounted ToastManager instance.
// Set once from App shell, consumed anywhere through useToast().
const toastManagerRef = ref<ToastManagerRef | null>(null);

/**
 * Internal helper to invoke a toast method if the manager is mounted.
 *
 * This is intentionally fail-safe: if the app shell has not mounted yet,
 * calls are ignored rather than throwing in feature components.
 */
function callToast(method: keyof ToastManagerRef, message: string): void {
  toastManagerRef.value?.[method](message);
}

/**
 * Registers or clears the app-level ToastManager instance.
 *
 * Expected usage:
 * - App.vue calls this when the manager ref becomes available.
 * - setToastManager(null) can be used during unmount/cleanup.
 */
export function setToastManager(manager: ToastManagerRef | null): void {
  toastManagerRef.value = manager;
}

/**
 * Global toast composable.
 *
 * Any component can call useToast() and emit toasts without owning toast UI.
 * Rendering remains centralized in the app shell's ToastManager instance.
 */
export function useToast() {
  return {
    // Green success toast for positive user actions.
    success: (message: string) => {
      callToast('success', message);
    },
    // Red error toast for recoverable failures.
    error: (message: string) => {
      callToast('error', message);
    },
    // Blue info toast for neutral state updates.
    info: (message: string) => {
      callToast('info', message);
    },
    // Amber warning toast for cautionary messages.
    warning: (message: string) => {
      callToast('warning', message);
    },
  };
}
