import { API_CONSTANTS, ApiBrewery, listBreweries, searchBreweries, singleBrewery } from './api';
import { ApiError } from './api-error';

// type corresponding with GraphQL type of the same name
export type Brewery = {
    id: string;
    name: string;
    breweryType: string | null;
    address1: string | null;
    address2: string | null;
    address3: string | null;
    city: string | null;
    stateProvince: string | null;
    postalCode: string | null;
    country: string | null;
    longitude: number | null;
    latitude: number | null;
    phone: string | null;
    websiteUrl: string | null;
};

// corresponds with GraphQL schema type BreweryListResults
export type BreweryListResult = {
    items: Brewery[];
    page: number;
    perPage: number;
    hasNextPage: boolean;
};

type GetBreweriesOptions = {
    searchName?: string;
    page?: number;
    perPage?: number;
};

function mapApiBrewery(response: ApiBrewery): Brewery {
    return {
        id: response.id,
        name: response.name,
        breweryType: response.brewery_type,
        address1: response.address_1,
        address2: response.address_2,
        address3: response.address_3,
        city: response.city,
        stateProvince: response.state_province,
        postalCode: response.postal_code,
        country: response.country,
        longitude: response.longitude,
        latitude: response.latitude,
        phone: response.phone,
        websiteUrl: response.website_url,
    };
}

export async function getBreweries(options?: GetBreweriesOptions): Promise<BreweryListResult> {
    // resolve parameters
    const { searchName, page, perPage } = options ?? {};
    const resolvedPage = page ?? API_CONSTANTS.defaults.page;
    const resolvedPerPage = perPage ?? API_CONSTANTS.defaults.per_page;

    // fetch breweries and map them to the Brewery type
    const items = searchName
        ? // filter by searched name
          (await searchBreweries({ query: searchName, page: resolvedPage, per_page: resolvedPerPage })).map(
              mapApiBrewery,
          )
        : // return all breweries paginated
          (await listBreweries({ page: resolvedPage, per_page: resolvedPerPage })).map(mapApiBrewery);

    // determine if there is a next page
    const hasNextPage = items.length === resolvedPerPage;

    return {
        items,
        page: resolvedPage,
        perPage: resolvedPerPage,
        hasNextPage,
    };
}

export async function getBreweryById(id: string): Promise<Brewery> {
    try {
        return mapApiBrewery(await singleBrewery(id));
    } catch (error: unknown) {
        // Handle 404 Api Errors- "brewery not found" is more useful than "page not found"
        if (error instanceof ApiError && error.status === 404) {
            throw new Error(`Brewery not found for id "${id}"`);
        }
        // Throw all other errors as they are
        throw error;
    }
}
