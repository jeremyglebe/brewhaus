import {
    BreweryListResult,
    QuerySearchBreweriesArgs,
} from '@brewhaus/shared/types/graphql';
import { searchBreweries } from '../services/api';
import { mapApiBrewery } from './map';
import API_CONSTANTS from '../services/api/constants';

// Search returns the same list result shape as browse mode so the client can reuse UI pieces.
export default async function gqlSearchBreweries(
    _parent: unknown,
    args: QuerySearchBreweriesArgs,
): Promise<BreweryListResult> {
    const { query, page, perPage } = args;

    // Resolve explicit query args against shared API defaults.
    const resolvedPage = page ?? API_CONSTANTS.defaults.page;
    const resolvedPerPage = perPage ?? API_CONSTANTS.defaults.per_page;

    // Forward the search query to the upstream REST endpoint.
    const response = await searchBreweries({
        query,
        page: resolvedPage,
        per_page: resolvedPerPage,
    });

    // Mirror the list query contract so the client can treat both results consistently.
    const items = response.map(mapApiBrewery);
    const hasNextPage = items.length === resolvedPerPage;

    return {
        items,
        page: resolvedPage,
        perPage: resolvedPerPage,
        hasNextPage,
    };
}
