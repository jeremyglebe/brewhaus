import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type {
  AllBreweriesMetaQuery,
  AllBreweriesMetaQueryVariables,
  BreweryListMeta,
} from '@/types/graphql';

export default async function fetchBreweriesMeta(
  variables: AllBreweriesMetaQueryVariables,
): Promise<BreweryListMeta> {
  const { data } = await apolloClient.query<AllBreweriesMetaQuery, AllBreweriesMetaQueryVariables>({
    query: QUERIES.ALL_BREWERIES_META,
    variables,
    fetchPolicy: 'network-only',
  });

  if (!data) {
    throw new Error('No data returned from breweries metadata query');
  }

  return data.listBreweriesMeta;
}
