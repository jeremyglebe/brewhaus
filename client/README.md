# Brewhaus Client

This package contains the Brewhaus frontend: a mobile-first Vue application that talks to the local GraphQL server and can also be packaged through Capacitor.

## What This Package Does

- renders the brewery list, search, settings, favorites, and detail flows
- queries the local GraphQL server through Apollo Client
- stores favorites and UI preferences locally on the device/browser
- supports normal browser development and Android emulator development
- provides the web layer used by the Capacitor native shells

## Stack

- Vue 3 + TypeScript
- Vite
- Vue Router
- Apollo Client
- Tailwind CSS + daisyUI
- Capacitor

## Install

```sh
npm install
```

The client also depends on the local shared package at `../shared`.

## Run In Browser Development

Start the GraphQL server first:

```sh
cd ../server
npm install
npm run dev
```

Then start the client:

```sh
cd ../client
npm install
npm run dev
```

Default local URLs:

- Client: `http://localhost:5173`
- GraphQL server: `http://localhost:4000/graphql`

## Environment Modes

The client expects `VITE_GRAPHQL_URL` to be set by the active Vite mode.

Two important local modes are used in this project:

- browser development: calls `http://localhost:4000/graphql`
- Android emulator development: calls `http://10.0.2.2:4000/graphql`

Why this matters:

- in a normal desktop browser, `localhost` is the host machine
- in an Android emulator, `localhost` points at the emulator itself
- `10.0.2.2` is the Android emulator alias back to the host machine

That is why the emulator mode must use a different GraphQL URL even when the server is running locally.

## Android Emulator Workflow

Use this when you want the Capacitor Android app to talk to the server running on the host machine.

1. Start the local GraphQL server from `server/`.
2. Build and sync the Android web assets from `client/`:

```sh
npm run prepare:android
```

3. Open the native Android project:

```sh
npx cap open android
```

Optional browser check for Android-mode env behavior:

```sh
npm run dev:android
```

## Build

```sh
npm run build
```

This runs shared TypeScript compilation, client type-checking, and the Vite production build.

## Lint

```sh
npm run lint
```

## Scripts

- `npm run dev`: start the Vite dev server for normal browser development
- `npm run dev:android`: run the client with Android-emulator GraphQL env values
- `npm run build`: type-check and build the web app
- `npm run build:android`: build with Android-mode env values
- `npm run sync:android`: sync Capacitor assets/plugins into the Android project
- `npm run prepare:android`: Android build plus Capacitor sync
- `npm run lint`: run oxlint and ESLint

## GraphQL Client Setup

The client GraphQL flow is intentionally simple:

- query documents live in `src/graphql/queries.ts`
- Apollo Client is configured in `src/lib/apollo.ts`
- feature-level fetch helpers in `src/services/brewery/` call Apollo
- Vue pages/components consume those helpers rather than building queries inline

That keeps page components focused on UI state and loading flow.

## Shared Types And Generated Code

This package consumes shared types from `@brewhaus/shared` and local generated GraphQL operation types.

Relevant pieces:

- shared schema source: `../shared/schema/schema.graphql`
- codegen config: `../shared/codegen.yml`
- generated operation/schema types: `../shared/types/graphql/generated/`

You only need to rerun codegen when GraphQL contracts change.

## UI And Mobile Shell Notes

### App shell

`src/App.vue` owns the global shell:

- top navigation
- favorites drawer
- bottom mobile dock
- centralized toast manager

### Route and modal detail behavior

List and search pages open brewery details in a modal so the user keeps context. A dedicated `/brewery/:id` route also exists for direct navigation, favorites, and a cleaner standalone mobile page.

### Infinite scroll vs pagination

Both list styles are implemented on purpose:

- infinite scroll is the default, touch-friendly demo flow
- pagination is available as a saved preference and as a more explicit reviewer-friendly alternative

The current paginated route is `/list/paginated`.

### Maps and geolocation

The client uses a lightweight iframe-based map embed plus Capacitor geolocation for directions. That keeps the demo focused and avoids pulling in a full mapping SDK.

## Capacitor Notes

This package is structured so the same Vue app can run in a browser first and in native shells second.

Basic Capacitor flow:

```sh
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

After web code changes, rebuild and sync before reopening or rebuilding native projects.

Geolocation permissions are configured in the native projects:

- iOS: `ios/App/App/Info.plist`
- Android: `android/app/src/main/AndroidManifest.xml`

## Reviewer Notes

If you are skimming the codebase for architecture, the most useful files are:

- `src/App.vue`
- `src/router/index.ts`
- `src/composables/useToast.ts`
- `src/composables/useFavorites.ts`
- `src/services/preferences/listMode.ts`
- `src/views/pages/ListPageInfinite.vue`
- `src/views/pages/ListPagePaginated.vue`
- `src/components/BreweryDetails.vue`
