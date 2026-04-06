import { gql } from '@apollo/client'

export const QUERIES = Object.freeze({
  ALL_BREWERIES: gql`
    query AllBreweries($page: Int!, $perPage: Int!) {
      breweries(page: $page, perPage: $perPage) {
        items {
          id
          name
          city
          stateProvince
          breweryType
        }
        page
        perPage
        hasNextPage
      }
    }
  `,
})
