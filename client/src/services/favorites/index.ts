import type { Brewery } from '@/types/graphql';
import { STORAGE_KEYS } from '@/services/storage/keys';
import { readJson, writeJson } from '@/services/storage/localStorage';

export type FavoriteBrewery = {
  id: string;
  name: string;
  city: string | null;
  stateProvince: string | null;
};

// Favorites intentionally persist only the small summary needed for drawer/list rendering.
// This avoids storing the entire GraphQL object shape in localStorage.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFavoriteBrewery(value: unknown): value is FavoriteBrewery {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && (typeof value.city === 'string' || value.city === null)
    && (typeof value.stateProvince === 'string' || value.stateProvince === null);
}

function readFavorites(): FavoriteBrewery[] {
  const storedFavorites = readJson<unknown>(STORAGE_KEYS.favorites, []);

  if (!Array.isArray(storedFavorites)) {
    return [];
  }

  return storedFavorites.filter(isFavoriteBrewery);
}

function writeFavorites(favorites: FavoriteBrewery[]): FavoriteBrewery[] {
  writeJson(STORAGE_KEYS.favorites, favorites);
  return favorites;
}

export function createFavoriteBrewerySummary(
  brewery: Pick<Brewery, 'id' | 'name' | 'city' | 'stateProvince'>,
): FavoriteBrewery {
  return {
    id: brewery.id,
    name: brewery.name,
    city: brewery.city ?? null,
    stateProvince: brewery.stateProvince ?? null,
  };
}

export function getFavorites(): FavoriteBrewery[] {
  return readFavorites();
}

export function isFavorite(breweryId: string): boolean {
  return readFavorites().some((favorite) => favorite.id === breweryId);
}

export function addFavorite(favorite: FavoriteBrewery): FavoriteBrewery[] {
  const favorites = readFavorites();
  const nextFavorites = [
    favorite,
    // Re-adding a favorite moves it to the top and prevents duplicates.
    ...favorites.filter((existingFavorite) => existingFavorite.id !== favorite.id),
  ];

  return writeFavorites(nextFavorites);
}

export function removeFavorite(breweryId: string): FavoriteBrewery[] {
  const nextFavorites = readFavorites().filter((favorite) => favorite.id !== breweryId);

  return writeFavorites(nextFavorites);
}

export function toggleFavorite(favorite: FavoriteBrewery): FavoriteBrewery[] {
  if (isFavorite(favorite.id)) {
    return removeFavorite(favorite.id);
  }

  return addFavorite(favorite);
}
