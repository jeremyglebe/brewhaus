# Brewhaus Server

This package hosts the local GraphQL API used by the Brewhaus client.

Its job is intentionally narrow:

- expose a small GraphQL schema tailored to the demo UI
- fetch brewery data from Open Brewery DB
- normalize upstream REST fields into the app's GraphQL types
- keep the client insulated from upstream API details

## Stack

- Node.js
- TypeScript
- Express 5
- Apollo Server
- GraphQL

## Install

```sh
npm install
```

The server depends on the local shared package at `../shared`, so that package should also have its dependencies installed.

## Run In Development

```sh
npm run dev
```

This starts the server with `tsx watch`.

Default endpoints:

- GraphQL: `http://localhost:4000/graphql`
- Health check: `http://localhost:4000/health`

The startup log also prints the Android-emulator-friendly GraphQL URL:

- `http://10.0.2.2:4000/graphql`

## Build And Run

```sh
npm run build
npm start
```

## Schema Source

The GraphQL SDL is not defined inside this package. The source of truth lives in:

- `../shared/schema/schema.graphql`

`src/schema/typeDefs.ts` reads that shared schema file directly, which keeps the schema contract centralized for both client and server.

## Resolver Structure

The resolver layer is intentionally flat and easy to scan:

- `src/resolvers/list.ts`: brewery list query
- `src/resolvers/listMeta.ts`: pagination metadata query
- `src/resolvers/search.ts`: search query
- `src/resolvers/fromId.ts`: single brewery lookup
- `src/resolvers/map.ts`: REST-to-GraphQL field mapping

This split keeps each resolver focused on one query or transformation step.

## API Composition Role

Open Brewery DB is a REST API, while the client consumes GraphQL.

The server bridges that gap by:

- translating GraphQL filter arguments to upstream query parameters
- applying shared defaults for page size and pagination
- mapping REST field names such as `brewery_type` to GraphQL fields such as `breweryType`
- adding a stable `imageUrl` placeholder field for richer UI presentation

That composition step is the main reason this package exists.

## Shared Types And Codegen

The server imports resolver and schema-related types from `@brewhaus/shared`.

Relevant shared files:

- `../shared/schema/schema.graphql`
- `../shared/codegen.yml`
- `../shared/types/graphql/generated/`

The server scripts run a shared package TypeScript build before server dev/build/start commands so local type imports stay available.

## Local Development Notes

- CORS is enabled for local client development.
- JSON request parsing is enabled for GraphQL POST bodies.
- No database or auth layer is involved in this package.
- Favorites and user preferences are client-only concerns and do not pass through the server.

## Tradeoffs

- The server stays intentionally thin and stateless because the take-home scope does not require persistence.
- Placeholder image URLs are generated server-side to keep the client presentation simple.
- Search, list, and metadata remain separate queries because that mirrors the UI's different loading needs and keeps the demo flows easy to explain.