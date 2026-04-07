import { readFileSync } from 'node:fs';

export const typeDefs = readFileSync(
    require.resolve('@brewhaus/shared/schema/schema.graphql'),
    'utf8',
);
