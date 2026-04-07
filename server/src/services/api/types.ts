import { BreweryType, SortDirection } from '@brewhaus/shared/types/enums';

// raw api response type from Open Brewery DB
export type ApiBrewery = {
    id: string;
    name: string;
    brewery_type: BreweryType | null;
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

export type ApiQueryFilters = {
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
    by_type?: BreweryType;
    // Page number for pagination. Default: 1.
    page?: number;
    // Number of breweries per page. Default: 50. Maximum: 200.
    per_page?: number;
    // Sort results by one or more fields using asc or desc.
    sort?: SortDirection;
};

export type ApiQuerySearch = {
    // Search term to match against brewery names. Supports partial matches.
    query: string;
    // Number of results per page. Default: 50. Maximum: 200.
    per_page?: number;
    // Page number for pagination. Default: 1.
    page?: number;
};

export type ApiBreweryMetaResponse = {
    total: number;
    page?: number;
    per_page?: number;
    by_state?: Record<string, number>;
    by_type?: Record<string, number>;
};
