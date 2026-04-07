import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type { gqlBrewery } from '@brewhaus/shared/types/graphql';

type QueryParameters = {
  id: string;
};

type QueryResult = {
  brewery: gqlBrewery;
};

export default async function fetchBreweryById(variables: QueryParameters): Promise<gqlBrewery> {
  // Make a graphql query to fetch the brewery details by id.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<QueryResult, QueryParameters>({
    query: QUERIES.BREWERY_BY_ID,
    variables,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('No data returned from brewery detail query');
  }

  return data.brewery;
}
