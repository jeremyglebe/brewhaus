# Brewhaus Client

Frontend application for Brewhaus, built with Vue 3, TypeScript, Tailwind CSS, daisyUI, and Apollo Client.

## Purpose

The client provides:

- Brewery list browsing
- Filtered listing
- Infinite-scroll list mode
- Alternate paginated list mode
- Search flow
- Brewery details via modal and dedicated route

## Prerequisites

- Node.js 20+
- npm 10+
- Server running locally at `http://localhost:4000/graphql`

## Install

```sh
npm install
```

## Development

```sh
npm run dev
```

Starts the Vite development server for the client.

### Android Emulator Development

Use this flow when running the app in the Android emulator against a local GraphQL server.

1. Start the GraphQL server on the host machine (outside this folder):

```sh
cd ../server
npm install
npm run dev
```

2. Build and sync the client for Android mode:

```sh
npm run prepare:android
```

3. Open Android Studio and run the emulator app:

```sh
npx cap open android
```

Optional: validate Android-mode env configuration in a browser tab before syncing:

```sh
npm run dev:android
```

### Why 10.0.2.2 Works (and localhost Does Not)

- In a browser on the host machine, `localhost` points to the host machine.
- In an Android emulator, `localhost` points to the emulator device itself.
- `10.0.2.2` is a special alias from the Android emulator to the host machine.
- So for a host GraphQL server at `http://localhost:4000/graphql`, the emulator must call `http://10.0.2.2:4000/graphql`.

Environment files are set up so this is automatic:

- `.env.development` uses `http://localhost:4000/graphql`
- `.env.android` uses `http://10.0.2.2:4000/graphql`

## Build

```sh
npm run build
```

Runs type-checking and creates a production build.

## Capacitor Integration

This client includes Capacitor so it can be packaged as native iOS and Android apps.

### Client setup

```sh
npm install
npm run build
npx cap sync
```

### Open platform projects

```sh
npx cap open android
npx cap open ios
```

Tip: after client code changes, run `npm run build` and `npx cap sync` again before reopening or rebuilding native projects.

## Lint

```sh
npm run lint
```

Runs ESLint for the client codebase.

## Scripts

- `npm run dev`: start development server
- `npm run dev:android`: start development server using Android emulator endpoint mode
- `npm run build`: type-check and production build
- `npm run build:android`: type-check and build using Android mode (`.env.android`)
- `npm run sync:android`: sync web assets and plugins to Android
- `npm run prepare:android`: run Android-mode build, then Android sync
- `npm run lint`: lint source files

## Notes

- The default list route uses infinite scroll.
- The alternate paginated list is available via manual route entry at `/list-paginated`.
