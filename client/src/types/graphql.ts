import type { QueryListBreweriesArgs } from '@brewhaus/shared/types/graphql/generated/schema';
import type {
  AllBreweriesMetaQuery,
  AllBreweriesMetaQueryVariables,
  AllBreweriesQuery,
  AllBreweriesQueryVariables,
  BreweryByIdQuery,
  BreweryByIdQueryVariables,
  SearchBreweriesQuery,
  SearchBreweriesQueryVariables,
} from '@brewhaus/shared/types/graphql/generated/operations';

export type Brewery = BreweryByIdQuery['brewery'];
export type BreweryList = AllBreweriesQuery['listBreweries'];
export type BreweryListMeta = AllBreweriesMetaQuery['listBreweriesMeta'];
export type BrewerySearchResult = SearchBreweriesQuery['searchBreweries'];
export type BreweryListFilters = NonNullable<QueryListBreweriesArgs['filters']>;

export type {
  AllBreweriesMetaQuery,
  AllBreweriesMetaQueryVariables,
  AllBreweriesQuery,
  AllBreweriesQueryVariables,
  BreweryByIdQuery,
  BreweryByIdQueryVariables,
  SearchBreweriesQuery,
  SearchBreweriesQueryVariables,
};
