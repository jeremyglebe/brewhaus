// Query resolver composition. Each file stays focused on one query or mapping concern.

import resolveBreweryById from './fromId';
import resolveListBreweries from './list';
import resolveListBreweriesMeta from './listMeta';
import resolveSearchBreweries from './search';

import type { Resolvers } from '@brewhaus/shared/types/graphql';

export const resolvers: Resolvers = {
    Query: {
        listBreweries: resolveListBreweries,
        listBreweriesMeta: resolveListBreweriesMeta,
        searchBreweries: resolveSearchBreweries,
        brewery: resolveBreweryById,
    },
};
