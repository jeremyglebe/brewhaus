export type BreweryListMode = 'infinite' | 'pagination';

const LIST_MODE_STORAGE_KEY = 'brewhaus:list-mode';
const DEFAULT_LIST_MODE: BreweryListMode = 'infinite';

function isValidListMode(value: string | null): value is BreweryListMode {
  return value === 'infinite' || value === 'pagination';
}

export function getDefaultListMode(): BreweryListMode {
  return DEFAULT_LIST_MODE;
}

export function getListModePreference(): BreweryListMode {
  const storedValue = window.localStorage.getItem(LIST_MODE_STORAGE_KEY);

  if (isValidListMode(storedValue)) {
    return storedValue;
  }

  return DEFAULT_LIST_MODE;
}

export function setListModePreference(mode: BreweryListMode): void {
  window.localStorage.setItem(LIST_MODE_STORAGE_KEY, mode);
}

export function resolveListModeRoute(mode: BreweryListMode): string {
  return mode === 'pagination' ? '/list/paginated' : '/list/infinite';
}
