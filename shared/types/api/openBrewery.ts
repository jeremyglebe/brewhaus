import type { SortDirection } from '../common';
import type { BreweryType } from '../graphql/generated/schema';

// Raw API response type from Open Brewery DB.
export type ApiBrewery = {
  id: string;
  name: string;
  brewery_type: BreweryType | null;
  address_1: string | null;
  address_2: string | null;
  address_3: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country: string | null;
  longitude: number | null;
  latitude: number | null;
  phone: string | null;
  website_url: string | null;
};

export type ApiQueryFilters = {
  by_city?: string;
  by_country?: string;
  by_dist?: string;
  by_ids?: string;
  by_name?: string;
  by_state?: string;
  by_postal?: string;
  by_type?: BreweryType;
  page?: number;
  per_page?: number;
  sort?: SortDirection;
};

export type ApiQuerySearch = {
  query: string;
  per_page?: number;
  page?: number;
};

export type ApiBreweryMetaResponse = {
  total: number;
  page?: number;
  per_page?: number;
  by_state?: Record<string, number>;
  by_type?: Record<string, number>;
};
