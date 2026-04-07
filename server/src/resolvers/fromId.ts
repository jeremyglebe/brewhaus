import type { Brewery, QueryBreweryArgs } from '@brewhaus/shared/types/graphql';
import { singleBrewery } from '../services/api';
import { mapApiBrewery } from './map';

// Single-item lookup used by the detail route and detail modal content.
export default async function gqlBreweryFromId(
    _parent: unknown,
    args: QueryBreweryArgs,
): Promise<Brewery> {
    const { id } = args;

    const response = await singleBrewery(id);

    return mapApiBrewery(response);
}
