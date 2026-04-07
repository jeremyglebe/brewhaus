# Shared Package (`@brewhaus/shared`)

This folder contains the contract layer for the app:

- GraphQL schema source (`schema/schema.graphql`)
- Shared TypeScript types (`types/`)
- GraphQL code generation config (`codegen.yml`)

It is the source of truth for API shapes used by both the client and server.

## Folder Layout

- `schema/`: GraphQL Schema Definition Language (SDL) files. Currently includes `schema.graphql`.
- `types/`: Shared TypeScript types, plus generated GraphQL typing output.
- `codegen.yml`: GraphQL Code Generator configuration.
- `package.json`: Scripts for building and generating types.

## Codegen Commands

From `shared/`:

- `npm run codegen`: one-time generation.
- `npm run codegen:watch`: regenerate on schema/document changes.

## `codegen.yml` (full file)

```yml
schema: ./schema/schema.graphql
documents:
  - ../client/src/graphql/**/*.ts
generates:
  ./types/graphql/generated/schema.ts:
    plugins:
      - typescript
      - typescript-resolvers
    config:
      useTypeImports: true
  ./types/graphql/generated/operations.ts:
    plugins:
      - typescript
      - typescript-operations
    config:
      useTypeImports: true
```

## Line-By-Line Breakdown

1. `schema: ./schema/schema.graphql`
   Tells codegen where the GraphQL schema definition lives.

2. `documents:`
   Starts the list of GraphQL operation documents (queries/mutations/fragments) to scan.

3. `- ../client/src/graphql/**/*.ts`
   Includes all `.ts` files under the client GraphQL folder recursively. This is where operation strings are discovered.

4. `generates:`
   Starts output definitions. Each key under this block is an output file and its generation config.

5. `./types/graphql/generated/schema.ts:`
   First output target. This file gets schema-focused TypeScript types.

6. `plugins:`
   Declares which codegen plugins to run for this output.

7. `- typescript`
   Generates base TypeScript types from GraphQL schema types.

8. `- typescript-resolvers`
   Generates resolver type signatures, mainly useful on the server side.

9. `config:`
   Per-output config block for plugin behavior.

10. `useTypeImports: true`
    Uses `import type` where possible. This avoids runtime import side effects and keeps emitted JS cleaner.

11. `./types/graphql/generated/operations.ts:`
    Second output target. This file gets operation-specific types (for query/mutation results and variables).

12. `plugins:`
    Plugin list for the operations output.

13. `- typescript`
    Generates shared schema type building blocks used by operations.

14. `- typescript-operations`
    Generates strongly typed result/variables for each discovered GraphQL document.

15. `config:`
    Per-output config for operations generation.

16. `useTypeImports: true`
    Same behavior as above: type-only imports where possible.

## How This Fits The Architecture

- Server contract source: The schema defines the API contract.
- Client operation source: Client GraphQL documents define which operation types are needed.
- Generated bridge: Codegen produces TypeScript artifacts that keep client and server aligned.
