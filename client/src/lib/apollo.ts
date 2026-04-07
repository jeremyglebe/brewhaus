import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL

const httpLink = new HttpLink({
  uri: graphqlUrl,
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  // Configure Apollo to use its standard in-memory normalized cache.
  cache: new InMemoryCache(),
})
