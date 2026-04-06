// the functions that answer queries

import { getBreweries, getBreweryById } from '../services/brewery';

export const resolvers = {
    // corresponds with the Query type in the schema
    Query: {
        // handles query breweries(page: Int, perPage: Int, search: String)
        // since page and perPage are defaulted in the schema, they will always be defined in args;
        // they do not need to be optional
        breweries: (_parent: unknown, args: { page: number; perPage: number; search?: string }) => {
            return getBreweries({ searchName: args.search, page: args.page, perPage: args.perPage });
        },

        // handles query brewery(id: ID!)
        brewery: (_parent: unknown, args: { id: string }) => {
            return getBreweryById(args.id);
        },
    },
};
