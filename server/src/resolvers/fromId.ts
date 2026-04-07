// brewery: (_parent: unknown, args: { id: string }) => Promise<gqlBrewery>;

import type { Brewery, QueryBreweryArgs } from '@brewhaus/shared/types/graphql';
import { singleBrewery } from '../services/api';
import { mapApiBrewery } from './map';

export default async function gqlBreweryFromId(
    _parent: unknown,
    args: QueryBreweryArgs,
): Promise<Brewery> {
    const { id } = args;
    // Get API response
    const response = await singleBrewery(id);
    // Extract data to a GraphQL Brewery object.
    const brewery = mapApiBrewery(response);
    return brewery;
}
