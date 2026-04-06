// the code that calls Open Brewery DB

import { ApiError } from './api-error';

const OPEN_BREWERY_BASE_URL = 'https://api.openbrewerydb.org/v1/breweries';

// raw api response type from Open Brewery DB
export type ApiBrewery = {
    id: string;
    name: string;
    brewery_type: string | null;
    address_1: string | null;
    address_2: string | null;
    address_3: string | null;
    city: string | null;
    state_province: string | null;
    postal_code: string | null;
    country: string | null;
    longitude: number | null;
    latitude: number | null;
    phone: string | null;
    website_url: string | null;
};

enum ApiBreweryType {
    // Most craft breweries. For example, Samual Adams is still considered a micro brewery.
    Micro = 'micro',
    // An extremely small brewery which typically only distributes locally.
    Nano = 'nano',
    // A regional location of an expanded brewery. Ex. Sierra Nevada’s Asheville, NC location.
    Regional = 'regional',
    // A beer-focused restaurant or restaurant/bar with a brewery on-premise.
    Brewpub = 'brewpub',
    // A very large brewery. Likely not for visitors. Ex. Miller-Coors. (deprecatedated)
    Large = 'large',
    // A brewery in planning or not yet opened to the public.
    Planning = 'planning',
    // A bar. No brewery equipment on premise. (deprecatedated)
    Bar = 'bar',
    // A brewery that uses another brewery’s equipment.
    Contract = 'contract',
    // Similar to contract brewing but refers more to a brewery incubator.
    Proprietor = 'proprietor',
    // A location which has been closed.
    Closed = 'closed',
}

enum ApiSortDirection {
    Ascending = 'asc',
    Descending = 'desc',
}

type ApiQueryFilters = {
    // Filter breweries by city.
    by_city?: string;
    // Filter breweries by country.
    by_country?: string;
    // Sort the results by distance from an origin point, denoted by `latitude,longitude`.
    by_dist?: string;
    // Comma-separated list of brewery IDs.
    by_ids?: string;
    // Filter breweries by name.
    by_name?: string;
    // Filter breweries by full state name (no abbreviations).
    by_state?: string;
    // Filter breweries by postal or ZIP code. Supports 5-digit and postal+4 formats.
    by_postal?: string;
    // Filter by brewery type (see by_type section for valid values).
    by_type?: ApiBreweryType;
    // Page number for pagination. Default: 1.
    page?: number;
    // Number of breweries per page. Default: 50. Maximum: 200.
    per_page?: number;
    // Sort results by one or more fields using asc or desc.
    sort?: ApiSortDirection;
};

type ApiQuerySearch = {
    // Search term to match against brewery names. Supports partial matches.
    query: string;
    // Number of results per page. Default: 50. Maximum: 200.
    per_page?: number;
    // Page number for pagination. Default: 1.
    page?: number;
};

// it may be useful to know what default values are used by the api in other parts of the code
export const API_CONSTANTS = {
    defaults: {
        page: 1,
        per_page: 50,
    },
    maximums: {
        per_page: 200,
    },
};

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
    const url = new URL(OPEN_BREWERY_BASE_URL);

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
    const url = new URL(`${OPEN_BREWERY_BASE_URL}/search`);

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
    const url = new URL(`${OPEN_BREWERY_BASE_URL}/${encodeURIComponent(id)}`);
    return fetchJson<ApiBrewery>(url.toString());
}
