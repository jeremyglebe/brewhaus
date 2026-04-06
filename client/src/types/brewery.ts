export type BreweryResultItem = {
  id: string
  name: string
  city: string | null
  stateProvince: string | null
  breweryType: string | null
}

export type BreweryResultPage = {
  items: BreweryResultItem[]
  page: number
  perPage: number
  hasNextPage: boolean
}

export type BreweryDetailResult = {
  id: string
  name: string
  breweryType: string | null
  address1: string | null
  address2: string | null
  address3: string | null
  city: string | null
  stateProvince: string | null
  postalCode: string | null
  country: string | null
  longitude: number | null
  latitude: number | null
  phone: string | null
  websiteUrl: string | null
}
