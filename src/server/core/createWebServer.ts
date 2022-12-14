// create http server
import http, { Server } from 'http';
import * as Sentry from '@sentry/node';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import compression from 'compression';
import cors from 'cors';
import express, { Express, Handler, Request, Response } from 'express';
import { execute, subscribe } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { graphqlUploadExpress } from 'graphql-upload';
import morgan from 'morgan';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import schema from '../schema';
import createContext, { Context, RootDocument } from '../schema/context';
import config from './config';
import setupPrometheusMetrics, { ApolloMetricsPlugin } from './prometheus';
import { expressRateLimiter } from './rateLimiter';
import { renderAdminApplication, renderClientApplication } from './renderApplications';
import { ApolloSentryPlugin } from './sentry';

export type WebServerCreation = {
    httpServer: Server;
    expressServer: Express;
    apolloServer: ApolloServer;
};

const rateLimiterMiddleware: Handler = (req, res, next) => {
    expressRateLimiter
        .consume(req.ip, 1)
        .then(() => {
            // move on to next handler
            next();
        })
        .catch(() => {
            // reject request
            res.status(429).send('Too Many Requests');
        });
};

const protectGraphQLEndpoint: Handler = (req, res, next) => {
    // prevent XSS attacks
    res.set({ 'X-Content-Type-Options': 'nosniff' });

    // move on to next handler
    next();
};

const disableCaching: Handler = (req, res, next) => {
    // update headers to disable caching behaviors
    res.set({
        'Cache-control': 'no-store',
        Pragma: 'no-cache',
    });

    // move on to next handler
    next();
};

const createWebServer = async (): Promise<WebServerCreation> => {
    // create express server
    const expressServer = express();

    // disable informational headers
    expressServer.disable('x-powered-by');

    if (config.gzip) {
        // enable compression
        // we might want to disable if it's delegated to a reverse proxy
        expressServer.use(compression());
    }

    // enable JSON and url encoded support
    expressServer.use(express.json());
    expressServer.use(express.urlencoded({ extended: true }));

    if (config.verbose) {
        // enable logs
        expressServer.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
    }

    // enable Sentry scope
    expressServer.use(Sentry.Handlers.requestHandler());

    // setup prometheus metrics
    await setupPrometheusMetrics(expressServer);

    if (config.sentry.tracing) {
        expressServer.use(Sentry.Handlers.tracingHandler());
    }

    // serve static files
    expressServer.use('/public', express.static('public'));

    // apply cors
    expressServer.use(
        cors((req, callback) => {
            // in production we expect the app to be served behind a reverse proxy such as the ingress controller
            // if so we rely on those information which are trust worthy as those are defined by the proxy itself
            const host = req.header('X-Forwarded-Host');
            const scheme = req.header('X-Forwarded-Scheme') || 'https';

            const origins = [`${scheme}://${host}`];

            if (process.env.NODE_ENV === 'development') {
                origins.push('https://studio.apollographql.com');
            }

            // apply cors
            callback(null, { origin: host ? origins : false, credentials: true });
        })
    );

    // then from here use rate limiter
    expressServer.use(rateLimiterMiddleware);

    // update cache policy
    expressServer.use(disableCaching);

    // create the http server
    const httpServer = http.createServer(expressServer);

    // create websocket server
    const subscriptionServer = SubscriptionServer.create(
        {
            schema,

            // protect against DDoS by using deep depth on GraphQL APIs
            validationRules: [depthLimit(10)],

            // coming from graphql
            execute,
            subscribe,

            // provide a custom context
            onConnect: (connectionParams, webSocket, context): Promise<Context> =>
                createContext(context.request, context.response),

            // provide a custom root document
            rootValue: (): RootDocument => null,
        },
        {
            server: httpServer,
            path: '/graphql',
        }
    );

    // prepare plugins for apollo
    const plugins: ApolloServerExpressConfig['plugins'] = [
        // sentry custom plugin for bug tracking
        ApolloSentryPlugin,

        // help apollo server to gracefully shutdown
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // help shutdown subscriptions as well
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    },
                };
            },
        },
    ];

    if (config.prometheus.enabled) {
        // custom plugin to extract prometheus metrics
        plugins.push(ApolloMetricsPlugin);
    }

    // create apollo server
    const apolloServer = new ApolloServer({
        schema,

        // protect against DDoS by using deep depth on GraphQL APIs
        validationRules: [depthLimit(10)],

        // provide a custom context
        context: ({ req, res }: { req: Request; res: Response }): Promise<Context> => createContext(req, res),

        // provide a custom root document
        rootValue: (): RootDocument => null,

        // enable introspection based on the configuration
        introspection: config.introspection,

        // apollo plugins
        plugins,
    });

    // start apollo server
    await apolloServer.start();

    // serve graphql API
    expressServer.use(
        '/graphql',
        protectGraphQLEndpoint,
        graphqlUploadExpress(),
        // disable CORS as we manage those at an upper level
        apolloServer.getMiddleware({ bodyParserConfig: { limit: '50mb' }, path: '/', cors: false })
    );

    expressServer.get('/admin', renderAdminApplication);

    // fallback on the application for all other paths
    expressServer.get('*', renderClientApplication);

    // sse the sentry error handler before any other error handler
    expressServer.use(Sentry.Handlers.errorHandler());

    // then here comes our error handler
    // eslint-disable-next-line no-unused-vars
    expressServer.use((error, request, response, next) => {
        // print it for logs
        console.error(error);
        // answer as 500 response
        response.status(500).send('Internal error');
    });

    return { httpServer, apolloServer, expressServer };
};

export default createWebServer;
