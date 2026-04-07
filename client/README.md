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
- `npm run build`: type-check and production build
- `npm run lint`: lint source files

## Notes

- The default list route uses infinite scroll.
- The alternate paginated list is available via manual route entry at `/list-paginated`.
