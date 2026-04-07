import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type {
  AllBreweriesQuery,
  AllBreweriesQueryVariables,
  BreweryList,
} from '@/types/graphql';

export default async function fetchAllBreweries(
  variables: AllBreweriesQueryVariables,
): Promise<BreweryList> {
  // Make the graphql query to fetch the breweries page data.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<AllBreweriesQuery, AllBreweriesQueryVariables>({
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
