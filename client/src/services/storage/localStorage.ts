function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Access can throw in privacy-restricted contexts, so storage reads stay fail-safe.
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readJson<T>(key: string, fallbackValue: T): T {
  const storage = getBrowserStorage();

  if (!storage) {
    return fallbackValue;
  }

  const storedValue = storage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return fallbackValue;
  }
}

export function readStoredString(key: string): string | null {
  const storage = getBrowserStorage();

  if (!storage) {
    return null;
  }

  return storage.getItem(key);
}

export function writeJson<T>(key: string, value: T): void {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(value));
}

export function removeStoredValue(key: string): void {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(key);
}
