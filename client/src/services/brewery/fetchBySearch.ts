// import { QUERIES } from '@/graphql/queries';
// import { apolloClient } from '@/lib/apollo';
// import type { gqlBreweryListResult } from '@brewhaus/shared/types/graphql';

import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type { gqlBreweryListResult } from '@brewhaus/shared/types/graphql';

type QueryParameters = {
  query: string;
  page?: number;
  per_page?: number;
};

type QueryResult = {
  searchBreweries: gqlBreweryListResult;
};

export default async function fetchBreweriesBySearch(
  variables: QueryParameters,
): Promise<gqlBreweryListResult> {
  // Make the graphql query to fetch the breweries page data.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<QueryResult, QueryParameters>({
    query: QUERIES.SEARCH_BREWERIES,
    variables,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('No data returned from brewery search query');
  }

  return data.searchBreweries;
}
