import { QUERIES } from '@/graphql/queries'
import { apolloClient } from '../lib/apollo'
import type { BreweryDetailResult, BreweryResultPage } from '../types/brewery'

type QueryResult = {
  breweries: BreweryResultPage
}

type QueryParameters = {
  page: number
  perPage: number
  search?: string
}

export async function fetchBreweriesPage(variables: QueryParameters): Promise<BreweryResultPage> {
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

export async function fetchBreweryById(id: string) {
  // Make a graphql query to fetch the brewery details by id.
  // 'network-only' ensures that the app doesn't use cached data.
  const { data } = await apolloClient.query<{ brewery: BreweryDetailResult }, { id: string }>({
    query: QUERIES.BREWERY_BY_ID,
    variables: { id },
    fetchPolicy: 'network-only',
  })

  if (!data || !data.brewery) {
    throw new Error('No data returned from brewery detail query')
  }

  return data.brewery
}
