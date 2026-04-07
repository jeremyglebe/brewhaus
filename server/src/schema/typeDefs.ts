import { readFileSync } from 'node:fs';

// The schema lives in the shared package so client and server read from the same contract.
export const typeDefs = readFileSync(
    require.resolve('@brewhaus/shared/schema/schema.graphql'),
    'utf8',
);
