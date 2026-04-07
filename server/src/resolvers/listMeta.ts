import {
    QueryListBreweriesMetaArgs,
    gqlBreweryListMetaResult,
} from '@brewhaus/shared/types/graphql';
import type { BreweryType } from '@brewhaus/shared/types/common';
import API_CONSTANTS from '../services/api/constants';
import { listBreweriesMeta } from '../services/api';

export default async function gqlListBreweriesMeta(
    _parent: unknown,
    args: QueryListBreweriesMetaArgs,
): Promise<gqlBreweryListMetaResult> {
    const { page, perPage, filters } = args;

    const resolvedPage = page ?? API_CONSTANTS.defaults.page;
    const resolvedPerPage = perPage ?? API_CONSTANTS.defaults.per_page;

    const apiResponse = await listBreweriesMeta({
        page: resolvedPage,
        per_page: resolvedPerPage,
        by_city: filters?.byCity ?? undefined,
        by_country: filters?.byCountry ?? undefined,
        by_state: filters?.byState ?? undefined,
        by_postal: filters?.byPostal ?? undefined,
        by_type: (filters?.byType as BreweryType | null | undefined) ?? undefined,
    });

    const total = Number(apiResponse.total);
    const safeTotal = Number.isFinite(total) && total > 0 ? total : 0;
    const totalPages = safeTotal > 0 ? Math.ceil(safeTotal / resolvedPerPage) : 1;

    return {
        total: safeTotal,
        page: resolvedPage,
        perPage: resolvedPerPage,
        totalPages,
    };
}
