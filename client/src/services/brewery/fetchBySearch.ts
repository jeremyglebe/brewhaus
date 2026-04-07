import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type {
  SearchBreweriesQuery,
  SearchBreweriesQueryVariables,
} from '@brewhaus/shared/types/graphql/generated/operations';

export default async function fetchBreweriesBySearch(
  variables: SearchBreweriesQueryVariables,
): Promise<SearchBreweriesQuery['searchBreweries']> {
  // Make the graphql query to fetch the breweries page data.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<SearchBreweriesQuery, SearchBreweriesQueryVariables>({
    query: QUERIES.SEARCH_BREWERIES,
    variables,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('No data returned from brewery search query');
  }

  return data.searchBreweries;
}
