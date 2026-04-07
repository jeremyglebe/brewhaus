import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type {
  gqlBreweryListFilters,
  gqlBreweryListMetaResult,
} from '@brewhaus/shared/types/graphql';

type QueryParameters = {
  page: number;
  perPage: number;
  filters?: gqlBreweryListFilters | null;
};

type QueryResult = {
  listBreweriesMeta: gqlBreweryListMetaResult;
};

export default async function fetchBreweriesMeta(
  variables: QueryParameters,
): Promise<gqlBreweryListMetaResult> {
  const { data } = await apolloClient.query<QueryResult, QueryParameters>({
    query: QUERIES.ALL_BREWERIES_META,
    variables,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('No data returned from breweries metadata query');
  }

  return data.listBreweriesMeta;
}
