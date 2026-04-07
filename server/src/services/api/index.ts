import API_CONSTANTS from './constants';
import { ApiError } from './error';
import { ApiBrewery, ApiQueryFilters, ApiQuerySearch } from './types';

// typed wrapper for fetch
async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        // Check if there is a response body and attempt to read it
        let responseBody: string | undefined;
        try {
            responseBody = await response.text();
        } catch {
            responseBody = undefined;
        }

        // throw a formatted error
        throw new ApiError({
            message: `Open Brewery DB request failed: ${response.status} ${response.statusText}`,
            status: response.status,
            statusText: response.statusText,
            url,
            responseBody,
        });
    }

    return response.json() as Promise<T>;
}

/**
 * Endpoint: /v1/breweries
 *
 * https://www.openbrewerydb.org/documentation#list-breweries
 * @returns a list of breweries.
 */
export async function listBreweries(filters?: ApiQueryFilters): Promise<ApiBrewery[]> {
    const url = new URL(API_CONSTANTS.base_url);

    if (filters) {
        if (filters.by_city) url.searchParams.set('by_city', filters.by_city);
        if (filters.by_country) url.searchParams.set('by_country', filters.by_country);
        if (filters.by_dist) url.searchParams.set('by_dist', filters.by_dist);
        if (filters.by_ids) url.searchParams.set('by_ids', filters.by_ids);
        if (filters.by_name) url.searchParams.set('by_name', filters.by_name);
        if (filters.by_state) url.searchParams.set('by_state', filters.by_state);
        if (filters.by_postal) url.searchParams.set('by_postal', filters.by_postal);
        if (filters.by_type) url.searchParams.set('by_type', filters.by_type);
        if (filters.page) url.searchParams.set('page', String(filters.page));
        if (filters.per_page) url.searchParams.set('per_page', String(filters.per_page));
        if (filters.sort) url.searchParams.set('sort', filters.sort);
    }

    return fetchJson<ApiBrewery[]>(url.toString());
}

/**
 * Search for breweries based on a search term. The search performs partial, case-insensitive matching against brewery names.
 *
 * Endpoint: /v1/breweries/search?query={search}
 *
 * https://www.openbrewerydb.org/documentation#search-breweries
 * @returns a list of breweries matching the search term; an empty array [] when no breweries match the search query.
 */
export async function searchBreweries(options: ApiQuerySearch): Promise<ApiBrewery[]> {
    const url = new URL(`${API_CONSTANTS.base_url}/search`);

    url.searchParams.set('query', options.query);
    if (options.per_page) url.searchParams.set('per_page', String(options.per_page));
    if (options.page) url.searchParams.set('page', String(options.page));

    return fetchJson<ApiBrewery[]>(url.toString());
}

/**
 * Get a single brewery.
 *
 * Endpoint: /v1/breweries/{obdb-id}
 *
 * https://www.openbrewerydb.org/documentation#single-brewery
 * @returns a single brewery by id.
 */
export async function singleBrewery(id: string): Promise<ApiBrewery> {
    const url = new URL(`${API_CONSTANTS.base_url}/${encodeURIComponent(id)}`);
    return fetchJson<ApiBrewery>(url.toString());
}
