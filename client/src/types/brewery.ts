export type Brewery = {
  id: string
  name: string
  city: string | null
  stateProvince: string | null
  breweryType: string | null
}

export type BreweryPage = {
  items: Brewery[]
  page: number
  perPage: number
  hasNextPage: boolean
}
