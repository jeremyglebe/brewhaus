import { ref } from 'vue';
import type { ToastManagerRef } from '@/components/ui/ToastManager.vue';

const toastManagerRef = ref<ToastManagerRef | null>(null);

function callToast(method: keyof ToastManagerRef, message: string): void {
  toastManagerRef.value?.[method](message);
}

export function setToastManager(manager: ToastManagerRef | null): void {
  toastManagerRef.value = manager;
}

export function useToast() {
  return {
    success: (message: string) => {
      callToast('success', message);
    },
    error: (message: string) => {
      callToast('error', message);
    },
    info: (message: string) => {
      callToast('info', message);
    },
    warning: (message: string) => {
      callToast('warning', message);
    },
  };
}
