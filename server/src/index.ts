// Express + Apollo bootstrapping

import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';

async function start(): Promise<void> {
    // create an express application
    const app = express();

    // to allow requests from the frontend
    app.use(cors());
    // to let express parse json request bodies (needed for graphql)
    app.use(express.json());

    // create the graphql server
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    // connect the apollo server to the express app on the /graphql endpoint
    app.use('/graphql', expressMiddleware(apolloServer));

    // create a health check endpoint
    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    // start the express server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    });
}

// Start the server and catch any startup errors
start().catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
});
