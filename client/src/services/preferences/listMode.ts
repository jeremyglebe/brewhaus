import { STORAGE_KEYS } from '@/services/storage/keys';
import { readJson, readStoredString, removeStoredValue, writeJson } from '@/services/storage/localStorage';

export type BreweryListMode = 'infinite' | 'pagination';

type Preferences = {
  listMode: BreweryListMode;
};

const DEFAULT_LIST_MODE: BreweryListMode = 'infinite';
const DEFAULT_PREFERENCES: Preferences = {
  listMode: DEFAULT_LIST_MODE,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidListMode(value: unknown): value is BreweryListMode {
  return value === 'infinite' || value === 'pagination';
}

function normalizePreferences(value: unknown): Preferences | null {
  if (!isRecord(value)) {
    return null;
  }

  const { listMode } = value;

  if (!isValidListMode(listMode)) {
    return null;
  }

  return {
    listMode,
  };
}

export function getDefaultListMode(): BreweryListMode {
  return DEFAULT_LIST_MODE;
}

export function getPreferences(): Preferences {
  const storedPreferences = normalizePreferences(
    readJson<unknown>(STORAGE_KEYS.preferences, null),
  );

  if (storedPreferences) {
    return storedPreferences;
  }

  const legacyListMode = readStoredString(STORAGE_KEYS.legacyListMode);

  if (isValidListMode(legacyListMode)) {
    const migratedPreferences: Preferences = {
      ...DEFAULT_PREFERENCES,
      listMode: legacyListMode,
    };

    writeJson(STORAGE_KEYS.preferences, migratedPreferences);
    removeStoredValue(STORAGE_KEYS.legacyListMode);

    return migratedPreferences;
  }

  return DEFAULT_PREFERENCES;
}

export function setPreferences(preferences: Preferences): void {
  writeJson(STORAGE_KEYS.preferences, preferences);
}

export function getListModePreference(): BreweryListMode {
  return getPreferences().listMode;
}

export function setListModePreference(mode: BreweryListMode): void {
  setPreferences({
    ...getPreferences(),
    listMode: mode,
  });
}

export function resolveListModeRoute(mode: BreweryListMode): string {
  return mode === 'pagination' ? '/list/paginated' : '/list/infinite';
}
