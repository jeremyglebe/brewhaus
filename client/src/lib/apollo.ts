import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// Vite mode controls which GraphQL endpoint the app targets.
// Browser dev uses localhost, while Android emulator mode swaps to 10.0.2.2.
const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;

const httpLink = new HttpLink({
  uri: graphqlUrl,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  // The demo favors explicit network fetches in the service layer,
  // but Apollo's normalized cache still provides a consistent client setup.
  cache: new InMemoryCache(),
});
