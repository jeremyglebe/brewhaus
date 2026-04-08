# Brewhaus

Brewhaus is an application for browsing breweries from Open Brewery DB through a small GraphQL layer and a mobile-friendly Vue client.

The project is organized as a small monorepo:

- `client/`: Vue 3 + Vite + Apollo Client + Capacitor UI shell
- `server/`: Express + Apollo Server GraphQL API that composes Open Brewery DB
- `shared/`: shared GraphQL schema, generated types, and cross-package TypeScript contracts

## Project Overview

The baseline product is a brewery browser with search and detail views. The implementation goes a bit further so the repo is easier to demo as an application rather than only as a minimum coding exercise:

- List breweries from a GraphQL endpoint
- Search breweries by name
- View brewery details
- Browse using either infinite scroll or explicit pagination
- Save favorites locally on the device
- Open brewery details either as an in-context modal or as a standalone route
- Render a map preview and optional directions experience
- Run as a normal web app or package the same client through Capacitor for mobile shells

## Stack

### Client

- Vue 3 with TypeScript
- Vite for local development/builds
- Tailwind CSS + daisyUI for the UI layer
- Apollo Client for GraphQL queries
- Vue Router for page flow
- Capacitor for Android/iOS packaging

### Server

- Node.js + TypeScript
- Express 5
- Apollo Server
- GraphQL
- Open Brewery DB as the upstream REST data source

### Shared Package

- Shared GraphQL SDL in `shared/schema/schema.graphql`
- Generated GraphQL types and resolver signatures in `shared/types/graphql/generated/`
- Shared package exports consumed by both client and server

## Features

### Core flow

- Brewery list view
- Brewery search
- Brewery detail view
- Responsive, mobile-first presentation

### Extended features

- Infinite-scroll list mode
- Alternate paginated list mode
- Filter controls on list pages
- Favorites stored in browser/device storage
- Detail modal from list/search flows plus standalone detail route
- Image placeholders for richer card/detail presentation
- Embedded map plus geolocation-powered directions button
- Capacitor-ready mobile packaging

## Architecture Highlights

### GraphQL as a composition layer

The client never talks directly to Open Brewery DB. It queries the local GraphQL server, and the server is responsible for:

- translating GraphQL arguments into upstream REST query params
- normalizing field names into the app's GraphQL shape
- adding small presentation-friendly fields such as placeholder image URLs
- keeping the client insulated from upstream response shape changes

This keeps the client simpler and makes the demo easier to explain during review.

### Shared schema and generated types

The GraphQL schema source of truth lives in `shared/schema/schema.graphql`.

From that schema:

- the server imports shared resolver types
- the client imports generated operation and entity types
- `shared/codegen.yml` points code generation at the client query documents

This avoids duplicating GraphQL contracts across packages and keeps the client/server boundary explicit.

### Route vs modal detail design

List and search flows open brewery details in a modal so the user can inspect an item without losing context. The same detail content is also available as a dedicated route for:

- deep linking
- favorites navigation
- a clearer full-page mobile flow
- interview/demo discussion about UX tradeoffs

### Preferences, storage, and favorites separation

On the client, persistence concerns are intentionally split into small layers:

- storage utilities handle raw localStorage reads/writes
- preference services manage saved app settings such as list mode
- favorites services manage the stored favorite brewery summaries
- composables expose reactive app-facing state to Vue components

That separation keeps UI files lighter and makes responsibilities easier to explain.

## Running The Project

### Prerequisites

- Node.js 20+
- npm 10+

### Install dependencies

Run this once in each package:

```sh
cd client
npm install

cd ../server
npm install

cd ../shared
npm install
```

### Start local development

Run the server:

```sh
cd server
npm run dev
```

Run the client in a second terminal:

```sh
cd client
npm run dev
```

Default local URLs:

- Client: `http://localhost:5173`
- GraphQL server: `http://localhost:4000/graphql`
- Health check: `http://localhost:4000/health`

## Browser Development

For standard browser development, the default client env points to:

`http://localhost:4000/graphql`

That is the mode used by `npm run dev` inside `client/`.

## Android Emulator Mode

Android emulators cannot use the host machine's `localhost` to reach the server. In that environment, the client must call the host through `10.0.2.2`.

Use this flow:

1. Start the server on the host machine.
2. In `client/`, build and sync Android assets:

```sh
npm run prepare:android
```

3. Open the Android project:

```sh
npx cap open android
```

Optional browser check for Android-mode env values:

```sh
cd client
npm run dev:android
```

In that mode the GraphQL URL resolves to `http://10.0.2.2:4000/graphql`.

## Generated Types And Codegen

The shared package includes GraphQL code generation config:

```sh
cd shared
npm run codegen
```

This is only needed when changing:

- the schema in `shared/schema/schema.graphql`
- client GraphQL documents in `client/src/graphql/`

Normal day-to-day local development does not require rerunning codegen unless those contracts change.

## Notable Design Decisions

- The server composes REST into GraphQL so the client stays presentation-focused.
- Infinite scroll is the default browsing mode because it suits a touch-first demo, while pagination is retained as an alternate UX and requirement-friendly path.
- Favorites are intentionally persisted locally only; no auth or backend account system is introduced.
- Placeholder imagery is used to demonstrate richer list/detail layouts without implying those images come from the brewery API.
- Map embedding is intentionally lightweight and sufficient for demo value without adding full mapping SDK complexity.

## Extension Scope Beyond The Minimum

Compared with a bare minimum list/search/detail implementation, this project also includes:

- monorepo package sharing
- GraphQL composition layer
- shared schema-driven typing
- favorites drawer and persistence
- settings-driven list mode preference
- mobile packaging support via Capacitor
- geolocation-backed directions flow

## Package Docs

- Client setup and environment notes: `client/README.md`
- Server setup and API composition notes: `server/README.md`
- UI primitive notes: `client/src/components/ui/README.md`

## Feature Checklist

### Original Required Features

- ✅ Main page listing breweries
- ✅ Pagination or lazy loading of breweries
	- Implemented as infinite scroll by default
- ✅ Simple search for breweries
- ✅ Brewery detail view
	- Implemented as an in-context modal from list/search flows
	- Also available as a standalone route for direct navigation and favorites

### Additional Features Implemented

- ✅ Monorepo structure with a shared package
- ✅ Mobile-first UI shell
- ✅ Filters on list pages
- ✅ Favorites saved locally on the device/browser
	- ✅ Favorites can open the standalone detail route
- ✅ Settings page to switch between infinite scroll and pagination
	- ✅ Separate paginated list implementation
- ✅ Placeholder images for each brewery
	- Used to demonstrate richer list/detail presentation rather than real brewery photos
- ✅ Latitude/longitude map display
	- Implemented with a lightweight Google Maps iframe embed
	- Includes a directions flow powered by Capacitor geolocation
- ✅ Capacitor integration
	- ✅ Android and iOS project shells included
	- ✅ Geolocation plugin integrated
- ✅ GraphQL composition layer between the client and Open Brewery DB
- ✅ Shared GraphQL schema and generated types across packages
