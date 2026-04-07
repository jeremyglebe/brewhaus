export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Brewery = {
  __typename?: 'Brewery';
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  address3?: Maybe<Scalars['String']['output']>;
  breweryType?: Maybe<BreweryType>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  stateProvince?: Maybe<Scalars['String']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type BreweryListFilters = {
  byCity?: InputMaybe<Scalars['String']['input']>;
  byCountry?: InputMaybe<Scalars['String']['input']>;
  byPostal?: InputMaybe<Scalars['String']['input']>;
  byState?: InputMaybe<Scalars['String']['input']>;
  byType?: InputMaybe<BreweryType>;
};

export type BreweryListMetaResult = {
  __typename?: 'BreweryListMetaResult';
  page: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type BreweryListResult = {
  __typename?: 'BreweryListResult';
  hasNextPage: Scalars['Boolean']['output'];
  items: Array<Brewery>;
  page: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
};

export enum BreweryType {
  Bar = 'bar',
  Brewpub = 'brewpub',
  Closed = 'closed',
  Contract = 'contract',
  Large = 'large',
  Micro = 'micro',
  Nano = 'nano',
  Planning = 'planning',
  Proprietor = 'proprietor',
  Regional = 'regional'
}

export type Query = {
  __typename?: 'Query';
  brewery: Brewery;
  listBreweries: BreweryListResult;
  listBreweriesMeta: BreweryListMetaResult;
  searchBreweries: BreweryListResult;
};


export type QueryBreweryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListBreweriesArgs = {
  filters?: InputMaybe<BreweryListFilters>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListBreweriesMetaArgs = {
  filters?: InputMaybe<BreweryListFilters>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchBreweriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};

export type AllBreweriesQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  perPage: Scalars['Int']['input'];
  filters?: InputMaybe<BreweryListFilters>;
}>;


export type AllBreweriesQuery = { __typename?: 'Query', listBreweries: { __typename?: 'BreweryListResult', page: number, perPage: number, hasNextPage: boolean, items: Array<{ __typename?: 'Brewery', id: string, name: string, imageUrl: string, breweryType?: BreweryType | null, address1?: string | null, address2?: string | null, address3?: string | null, city?: string | null, stateProvince?: string | null, postalCode?: string | null, country?: string | null, longitude?: number | null, latitude?: number | null, phone?: string | null, websiteUrl?: string | null }> } };

export type AllBreweriesMetaQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  perPage: Scalars['Int']['input'];
  filters?: InputMaybe<BreweryListFilters>;
}>;


export type AllBreweriesMetaQuery = { __typename?: 'Query', listBreweriesMeta: { __typename?: 'BreweryListMetaResult', total: number, page: number, perPage: number, totalPages: number } };

export type BreweryByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BreweryByIdQuery = { __typename?: 'Query', brewery: { __typename?: 'Brewery', id: string, name: string, imageUrl: string, breweryType?: BreweryType | null, address1?: string | null, address2?: string | null, address3?: string | null, city?: string | null, stateProvince?: string | null, postalCode?: string | null, country?: string | null, longitude?: number | null, latitude?: number | null, phone?: string | null, websiteUrl?: string | null } };

export type SearchBreweriesQueryVariables = Exact<{
  query: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchBreweriesQuery = { __typename?: 'Query', searchBreweries: { __typename?: 'BreweryListResult', page: number, perPage: number, hasNextPage: boolean, items: Array<{ __typename?: 'Brewery', id: string, name: string, imageUrl: string, breweryType?: BreweryType | null, address1?: string | null, address2?: string | null, address3?: string | null, city?: string | null, stateProvince?: string | null, postalCode?: string | null, country?: string | null, longitude?: number | null, latitude?: number | null, phone?: string | null, websiteUrl?: string | null }> } };
