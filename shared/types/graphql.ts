// typescript equivalents of GraphQL types defined in server/src/schema/typeDefs.ts
// types which directly correspond to the GraphQL schema are given the prefix "gql"
// some types may narrow the fields' types to be more specific than the GraphQL schema, but only where it is expected
// that the values be more narrow (e.g. there is an enumerated list of possible values for breweryType)

import { BreweryType } from './enums';

export interface gqlBrewery {
    id: string;
    name: string;
    breweryType?: BreweryType | null;
    address1?: string | null;
    address2?: string | null;
    address3?: string | null;
    city?: string | null;
    stateProvince?: string | null;
    postalCode?: string | null;
    country?: string | null;
    longitude?: number | null;
    latitude?: number | null;
    phone?: string | null;
    websiteUrl?: string | null;
}

export interface gqlBreweryListResult {
    items: gqlBrewery[];
    page: number;
    perPage: number;
    hasNextPage: boolean;
}

export interface gqlBreweryListFilters {
    byCity?: string | null;
    byCountry?: string | null;
    byState?: string | null;
    byPostal?: string | null;
    byType?: BreweryType | null;
}

export interface gqlQuery {
    listBreweries: (
        _parent: unknown,
        args: {
            page?: number;
            perPage?: number;
            filters?: gqlBreweryListFilters;
        },
    ) => Promise<gqlBreweryListResult>;
    searchBreweries: (
        _parent: unknown,
        args: { query: string; page?: number; perPage?: number },
    ) => Promise<gqlBreweryListResult>;
    brewery: (_parent: unknown, args: { id: string }) => Promise<gqlBrewery>;
}

export interface gqlResolvers {
    Query: gqlQuery;
    // Apollo expects arbitrary keys for types of resolvers, so we need to allow for that
    // So while this type won't be fully type-safe, it will at least ensure that the Query field is correctly typed
    [typeName: string]: any;
}
