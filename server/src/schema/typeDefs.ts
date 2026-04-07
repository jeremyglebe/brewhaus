// the GraphQL contract

export const typeDefs = `#graphql
type Brewery {
  id: ID!
  name: String!
  breweryType: String
  address1: String
  address2: String
  address3: String
  city: String
  stateProvince: String
  postalCode: String
  country: String
  longitude: Float
  latitude: Float
  phone: String
  websiteUrl: String
}

type BreweryListResult {
  items: [Brewery!]!
  page: Int!
  perPage: Int!
  hasNextPage: Boolean!
}

input BreweryListFilters {
  byCity: String
  byCountry: String
  byState: String
  byPostal: String
  byType: String
}

type Query {
  listBreweries(
    page: Int = 1
    perPage: Int = 12
    filters: BreweryListFilters
  ): BreweryListResult!

  searchBreweries(
    query: String!
    page: Int = 1
    perPage: Int = 12
  ): BreweryListResult!

  brewery(id: ID!): Brewery!
}
`;
