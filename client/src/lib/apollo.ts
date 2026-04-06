import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  // need this explained- just specifying what type of cache is used?
  // I guess in case file cacheing can be used?
  cache: new InMemoryCache(),
})
