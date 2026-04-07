import type { BreweryType } from '../common/enums';
import type {
    Brewery,
    BreweryListFilters,
    BreweryListMetaResult,
    BreweryListResult,
    Resolvers,
} from './generated/schema';

export type gqlBrewery = Brewery;

export type gqlBreweryListResult = Omit<BreweryListResult, 'items'> & {
    items: gqlBrewery[];
};

export type gqlBreweryListMetaResult = BreweryListMetaResult;

export type gqlBreweryListFilters = Omit<BreweryListFilters, 'byType'> & {
    byType?: BreweryType | null;
};

export type gqlQuery = NonNullable<Resolvers['Query']>;

export type gqlResolvers = Resolvers;

export type {
    Brewery,
    BreweryListFilters,
    BreweryListMetaResult,
    BreweryListResult,
    QueryBreweryArgs,
    QueryListBreweriesArgs,
    QueryListBreweriesMetaArgs,
    QuerySearchBreweriesArgs,
    Resolvers,
} from './generated/schema';