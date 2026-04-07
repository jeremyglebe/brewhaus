import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Brewery: ResolverTypeWrapper<Brewery>;
  BreweryListFilters: BreweryListFilters;
  BreweryListMetaResult: ResolverTypeWrapper<BreweryListMetaResult>;
  BreweryListResult: ResolverTypeWrapper<BreweryListResult>;
  BreweryType: BreweryType;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Brewery: Brewery;
  BreweryListFilters: BreweryListFilters;
  BreweryListMetaResult: BreweryListMetaResult;
  BreweryListResult: BreweryListResult;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
};

export type BreweryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Brewery'] = ResolversParentTypes['Brewery']> = {
  address1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address3?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  breweryType?: Resolver<Maybe<ResolversTypes['BreweryType']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stateProvince?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  websiteUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type BreweryListMetaResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BreweryListMetaResult'] = ResolversParentTypes['BreweryListMetaResult']> = {
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type BreweryListResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BreweryListResult'] = ResolversParentTypes['BreweryListResult']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Brewery']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  brewery?: Resolver<ResolversTypes['Brewery'], ParentType, ContextType, RequireFields<QueryBreweryArgs, 'id'>>;
  listBreweries?: Resolver<ResolversTypes['BreweryListResult'], ParentType, ContextType, RequireFields<QueryListBreweriesArgs, 'page' | 'perPage'>>;
  listBreweriesMeta?: Resolver<ResolversTypes['BreweryListMetaResult'], ParentType, ContextType, RequireFields<QueryListBreweriesMetaArgs, 'page' | 'perPage'>>;
  searchBreweries?: Resolver<ResolversTypes['BreweryListResult'], ParentType, ContextType, RequireFields<QuerySearchBreweriesArgs, 'page' | 'perPage' | 'query'>>;
};

export type Resolvers<ContextType = any> = {
  Brewery?: BreweryResolvers<ContextType>;
  BreweryListMetaResult?: BreweryListMetaResultResolvers<ContextType>;
  BreweryListResult?: BreweryListResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

