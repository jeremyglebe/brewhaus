# UI Components

This folder contains reusable UI primitives used across pages.

## ToastManager.vue

Purpose:
- Renders stacked daisyUI toasts in one central location.

How it is controlled:
- Imperatively through a template ref.
- Public API exposed with `defineExpose`:
  - `success(message: string)`
  - `error(message: string)`
  - `info(message: string)`
  - `warning(message: string)`

Normal app usage:
- Mounted once in app shell (`src/App.vue`).
- Registered via `setToastManager()` from `src/composables/useToast.ts`.
- Most feature components should not import this UI component directly.

## useToast.ts (Composable bridge)

Purpose:
- Provides global toast methods to any component without requiring local toast UI ownership.

Why this exists:
- Prevents multiple toast containers in nested views/modals.
- Keeps toast rendering centralized at root while callers remain lightweight.

Usage:
- In a feature component:
  - `const toast = useToast()`
  - `toast.success('Saved')`

Requirements:
- `ToastManager` must be mounted and registered by app shell.
- If called before registration, toast calls are safely ignored.

## GenericModal.vue

Purpose:
- Reusable modal shell built on native `<dialog>` with daisyUI modal styling.

How it is controlled:
- Imperative ref methods:
  - `open(data?)`
  - `close()`

Data flow:
- `open(data)` stores payload.
- Payload is exposed to modal content through slot prop `data`.
- Example: `#default="{ data }"` and `data?.breweryId`.

Props:
- `title?: string` (default: `Details`)
- `boxClass?: string` (default: `max-w-2xl`)

Events:
- `close` emitted whenever dialog closes.

## PaginationControls.vue

Purpose:
- Reusable paging toolbar used by paginated list screens.

What it handles:
- Prev/Next buttons
- Compact page button range with ellipsis
- Loading indicator state
- Page/result summary

Props:
- `currentPage: number`
- `totalPages: number`
- `totalCount: number`
- `loading: boolean`

Events:
- `navigate(page: number)` when user requests a page change.

Design note:
- Parent owns data fetching and validation.
- Component only emits page intent and renders current state.
