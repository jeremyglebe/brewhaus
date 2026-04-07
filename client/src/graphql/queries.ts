import { gql } from '@apollo/client';

export const QUERIES = Object.freeze({
  ALL_BREWERIES: gql`
    query AllBreweries($page: Int!, $perPage: Int!) {
      listBreweries(page: $page, perPage: $perPage) {
        page
        perPage
        hasNextPage
        items {
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
  SEARCH_BREWERIES: gql`
    query SearchBreweries($query: String!, $page: Int, $perPage: Int) {
      searchBreweries(query: $query, page: $page, perPage: $perPage) {
        page
        perPage
        hasNextPage
        items {
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
    }
  `,
});
