import { QUERIES } from '@/graphql/queries';
import { apolloClient } from '@/lib/apollo';
import type {
  AllBreweriesMetaQuery,
  AllBreweriesMetaQueryVariables,
} from '@brewhaus/shared/types/graphql/generated/operations';

export default async function fetchBreweriesMeta(
  variables: AllBreweriesMetaQueryVariables,
): Promise<AllBreweriesMetaQuery['listBreweriesMeta']> {
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
