import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type {
  BreweryByIdQuery,
  BreweryByIdQueryVariables,
} from '@brewhaus/shared/types/graphql/generated/operations';

export default async function fetchBreweryById(
  variables: BreweryByIdQueryVariables,
): Promise<BreweryByIdQuery['brewery']> {
  // Make a graphql query to fetch the brewery details by id.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<BreweryByIdQuery, BreweryByIdQueryVariables>({
    query: QUERIES.BREWERY_BY_ID,
    variables,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('No data returned from brewery detail query');
  }

  return data.brewery;
}
