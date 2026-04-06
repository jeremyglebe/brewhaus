import { QUERIES } from '@/graphql/queries'
import { apolloClient } from '../lib/apollo'
import type { BreweryPage } from '../types/brewery'

type QueryResult = {
  breweries: BreweryPage
}

type QueryParameters = {
  page: number
  perPage: number
}

export async function fetchBreweriesPage(variables: QueryParameters): Promise<BreweryPage> {
  // Make the graphql query to fetch the breweries page data.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<QueryResult, QueryParameters>({
    query: QUERIES.ALL_BREWERIES,
    variables,
    fetchPolicy: 'network-only',
  })

  if (!data) {
    throw new Error('No data returned from breweries page query')
  }

  return data.breweries
}
