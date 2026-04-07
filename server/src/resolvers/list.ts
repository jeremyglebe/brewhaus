import {
    BreweryListResult,
    QueryListBreweriesArgs,
} from '@brewhaus/shared/types/graphql';
import { listBreweries } from '../services/api';
import { mapApiBrewery } from './map';
import API_CONSTANTS from '../services/api/constants';

// List query used by the default infinite-scroll experience and by paginated mode.
export default async function gqlListBreweries(
    _parent: unknown,
    args: QueryListBreweriesArgs,
): Promise<BreweryListResult> {
    const { page, perPage, filters } = args;

    // Resolve explicit query args against shared API defaults.
    const resolvedPage = page ?? API_CONSTANTS.defaults.page;
    const resolvedPerPage = perPage ?? API_CONSTANTS.defaults.per_page;

    // Translate GraphQL filter names into the upstream REST query shape.
    const apiResponse = await listBreweries({
        page: resolvedPage,
        per_page: resolvedPerPage,
        by_city: filters?.byCity ?? undefined,
        by_country: filters?.byCountry ?? undefined,
        by_state: filters?.byState ?? undefined,
        by_postal: filters?.byPostal ?? undefined,
        by_type: filters?.byType ?? undefined,
    });

    // The upstream API does not expose a dedicated next-page flag,
    // so a full page implies there may be another page available.
    const items = apiResponse.map(mapApiBrewery);
    const hasNextPage = items.length === resolvedPerPage;

    return {
        items,
        page: resolvedPage,
        perPage: resolvedPerPage,
        hasNextPage,
    };
}
