// Express + Apollo bootstrapping for the local GraphQL composition server.

import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';

async function start(): Promise<void> {
    // Express hosts both the GraphQL endpoint and a small health check for local dev.
    const app = express();

    // Allow local browser and emulator clients to talk to the API.
    app.use(cors());
    // GraphQL POST requests arrive as JSON.
    app.use(express.json());

    // Apollo is given the shared schema SDL and typed resolvers.
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    // Mount GraphQL under a single local endpoint consumed by the client app.
    app.use('/graphql', expressMiddleware(apolloServer));

    // Simple health endpoint for quick local smoke checks.
    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    // Default host/port support browser and Android-emulator development.
    const PORT = Number(process.env.PORT || 4000);
    const HOST = process.env.HOST || '0.0.0.0';

    app.listen(PORT, HOST, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
        console.log(`Android emulator endpoint: http://10.0.2.2:${PORT}/graphql`);
        console.log(`Listening on ${HOST}:${PORT}`);
    });
}

// Surface startup failures clearly in local development.
start().catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
});
