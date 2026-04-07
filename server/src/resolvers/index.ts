// the functions that answer queries

import gqlListBreweries from './list';
import gqlListBreweriesMeta from './listMeta';
import gqlSearchBreweries from './search';
import gqlBreweryFromId from './fromId';

import type { Resolvers } from '@brewhaus/shared/types/graphql';

export const resolvers: Resolvers = {
    Query: {
        listBreweries: gqlListBreweries,
        listBreweriesMeta: gqlListBreweriesMeta,
        searchBreweries: gqlSearchBreweries,
        brewery: gqlBreweryFromId,
    },
};
