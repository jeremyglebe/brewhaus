// brewery: (_parent: unknown, args: { id: string }) => Promise<gqlBrewery>;

import { gqlBrewery } from '@brewhaus/shared/types/graphql';
import { singleBrewery } from '../services/api';
import { mapApiBrewery } from './map';

export default async function gqlBreweryFromId(_parent: unknown, args: { id: string }): Promise<gqlBrewery> {
    const { id } = args;
    // Get API response
    const response = await singleBrewery(id);
    // Extract data to a gqlBrewery object
    const brewery = mapApiBrewery(response);
    return brewery;
}
