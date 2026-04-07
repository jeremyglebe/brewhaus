import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type { gqlBreweryListResult } from '@brewhaus/shared/types/graphql';

type QueryParameters = {
  page: number;
  perPage: number;
};

type QueryResult = {
  listBreweries: gqlBreweryListResult;
};

export default async function fetchAllBreweries(
  variables: QueryParameters,
): Promise<gqlBreweryListResult> {
  // Make the graphql query to fetch the breweries page data.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<QueryResult, QueryParameters>({
    query: QUERIES.ALL_BREWERIES,
    variables,
    fetchPolicy: 'network-only',
  });

  console.log('Fetched breweries page data:', data);

  if (!data) {
    throw new Error('No data returned from breweries page query');
  }

  return data.listBreweries;
}
