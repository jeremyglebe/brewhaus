import type { BreweryType } from '../common/enums';
import type {
    BreweryListFilters,
    Resolvers,
} from './generated/schema';
import type {
    AllBreweriesMetaQuery,
    AllBreweriesQuery,
    BreweryByIdQuery,
    SearchBreweriesQuery,
} from './generated/operations';

export type gqlBrewery = BreweryByIdQuery['brewery'];

export type gqlBreweryListResult = AllBreweriesQuery['listBreweries'];

export type gqlBreweryListMetaResult = AllBreweriesMetaQuery['listBreweriesMeta'];

export type gqlSearchBreweriesResult = SearchBreweriesQuery['searchBreweries'];

export type gqlBreweryListFilters = Omit<BreweryListFilters, 'byType'> & {
    byType?: BreweryType | null;
};

export type gqlQuery = NonNullable<Resolvers['Query']>;

export type gqlResolvers = Resolvers;

export type {
    BreweryListFilters,
    QueryBreweryArgs,
    QueryListBreweriesArgs,
    QueryListBreweriesMetaArgs,
    QuerySearchBreweriesArgs,
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