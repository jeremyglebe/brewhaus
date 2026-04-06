import { gql } from '@apollo/client'

export const QUERIES = Object.freeze({
  ALL_BREWERIES: gql`
    query AllBreweries($page: Int!, $perPage: Int!, $search: String) {
      breweries(page: $page, perPage: $perPage, search: $search) {
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
  BREWERY_BY_ID: gql`
    query BreweryById($id: ID!) {
      brewery(id: $id) {
        id
        name
        breweryType
        address1
        address2
        address3
        city
        stateProvince
        postalCode
        country
        longitude
        latitude
        phone
        websiteUrl
      }
    }
  `,
})
