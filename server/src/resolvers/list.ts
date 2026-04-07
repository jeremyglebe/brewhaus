import {
    QueryListBreweriesArgs,
    gqlBreweryListResult,
} from '@brewhaus/shared/types/graphql';
import type { BreweryType } from '@brewhaus/shared/types/common';
import { listBreweries } from '../services/api';
import { mapApiBrewery } from './map';
import API_CONSTANTS from '../services/api/constants';

export default async function gqlListBreweries(
    _parent: unknown,
    args: QueryListBreweriesArgs,
): Promise<gqlBreweryListResult> {
    const { page, perPage, filters } = args;

    // Provide default values
    const resolvedPage = page ?? API_CONSTANTS.defaults.page;
    const resolvedPerPage = perPage ?? API_CONSTANTS.defaults.per_page;

    // Get API response
    const apiResponse = await listBreweries({
        page: resolvedPage,
        per_page: resolvedPerPage,
        by_city: filters?.byCity ?? undefined,
        by_country: filters?.byCountry ?? undefined,
        by_state: filters?.byState ?? undefined,
        by_postal: filters?.byPostal ?? undefined,
        by_type: (filters?.byType as BreweryType | null | undefined) ?? undefined,
    });

    // Extract data from response
    const items = apiResponse.map(mapApiBrewery);
    const hasNextPage = items.length === resolvedPerPage;

    return {
        items,
        page: resolvedPage,
        perPage: resolvedPerPage,
        hasNextPage,
    };
}
