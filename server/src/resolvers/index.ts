// the functions that answer queries

import { gqlResolvers } from '@brewhaus/shared/types/graphql';
import gqlListBreweries from './list';
import gqlSearchBreweries from './search';
import gqlBreweryFromId from './fromId';

export const resolvers: gqlResolvers = {
    Query: {
        listBreweries: gqlListBreweries,
        searchBreweries: gqlSearchBreweries,
        brewery: gqlBreweryFromId,
    },
};
