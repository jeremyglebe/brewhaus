import {
    QuerySearchBreweriesArgs,
    gqlBreweryListResult,
} from '@brewhaus/shared/types/graphql';
import { searchBreweries } from '../services/api';
import { mapApiBrewery } from './map';
import API_CONSTANTS from '../services/api/constants';

export default async function gqlSearchBreweries(
    _parent: unknown,
    args: QuerySearchBreweriesArgs,
): Promise<gqlBreweryListResult> {
    const { query, page, perPage } = args;

    // Provide default values
    const resolvedPage = page ?? API_CONSTANTS.defaults.page;
    const resolvedPerPage = perPage ?? API_CONSTANTS.defaults.per_page;

    // Get API response
    const response = await searchBreweries({
        query,
        page: resolvedPage,
        per_page: resolvedPerPage,
    });

    // Extract data from response
    const items = response.map(mapApiBrewery);
    const hasNextPage = items.length === resolvedPerPage;

    return {
        items,
        page: resolvedPage,
        perPage: resolvedPerPage,
        hasNextPage,
    };
}
