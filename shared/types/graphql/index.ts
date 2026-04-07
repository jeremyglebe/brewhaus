import type { QueryListBreweriesArgs } from './generated/schema';

export type BreweryListFiltersInput = NonNullable<QueryListBreweriesArgs['filters']>;

export type {
    Brewery,
    BreweryListFilters,
    BreweryListMetaResult,
    BreweryListResult,
    BreweryType,
    QueryBreweryArgs,
    QueryListBreweriesArgs,
    QueryListBreweriesMetaArgs,
    QuerySearchBreweriesArgs,
    QueryResolvers,
    Resolvers,
} from './generated/schema';

export type {
    AllBreweriesMetaQuery,
    AllBreweriesMetaQueryVariables,
    AllBreweriesQuery,
    AllBreweriesQueryVariables,
    BreweryByIdQuery,
    BreweryByIdQueryVariables,
    SearchBreweriesQuery,
    SearchBreweriesQueryVariables,
} from './generated/operations';