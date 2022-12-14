import * as Sentry from '@sentry/node';
import { Request, Response, Handler } from 'express';
import { ComponentType } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { AdminAppProps, AdminAppState, AdminRuntimeConfig, AdminStoreType } from '../../../admin/types';
import { ClientAppProps, ClientAppState, ClientRuntimeConfig, ClientStoreType } from '../../../app/types';
import createI18Instance from '../../../shared/createI18nInstance/node';
import { getDefaultLocale } from '../../database';
import createContext from '../../schema/context';
import Document from '../Document';
import config from '../config';
import createApolloClient from '../createApolloClient';
import getManifest from '../getManifest';

const externalCdn = config.publicPath.startsWith('http')
    ? // we are using a CDN for serving the assets
      new URL(config.publicPath).hostname
    : null;

// generate CSP rule
const cspRule = `${['script-src', "'self'", externalCdn].filter(Boolean).join(' ')};`;

export type AppProps = AdminAppProps | ClientAppProps;
export type RuntimeConfig = AdminRuntimeConfig | ClientRuntimeConfig;
export type StoreType = AdminStoreType | ClientStoreType;
export type AppState = AdminAppState | ClientAppState;

type AppOptions = {
    appName: string;
    baseRoute: string;
    App: ComponentType<AppProps>;
    store: StoreType;
};

/**
 * Implement seperate handlers for admin and client if you have different options, configs, stores,etc.
 */

const execute = async (req: Request, res: Response, appOptions: AppOptions): Promise<void> => {
    const sheet = new ServerStyleSheet();

    const { store, App, appName, baseRoute } = appOptions;

    try {
        // TODO: detect the local from the browser at first
        const currentLocale = await getDefaultLocale();

        const runtime: RuntimeConfig = {
            version: config.version,
            publicPath: config.publicPath,
            defaultLocale: currentLocale,
            locales: config.i18n.locales,
            sentry: config.sentry,
        };

        const preloadedState = store.getState();

        // create graphql context
        const graphqlContext = await createContext(req, res);

        const { i18n } = await createI18Instance(currentLocale);

        // get the element
        const routerContext: StaticRouterContext = {};
        const appElement = sheet.collectStyles(
            <StaticRouter basename={baseRoute} context={routerContext} location={req.url}>
                <Provider store={store}>
                    <App createApolloClient={createApolloClient(graphqlContext)} i18n={i18n} runtime={runtime} />
                </Provider>
            </StaticRouter>
        );

        let body: string;

        try {
            // generate the body
            body = renderToString(appElement);
        } catch (renderingError) {
            // capture it
            console.error(renderingError);
            Sentry.captureException(renderingError);

            // redirect to internal error page
            res.redirect('/500');

            // stop here
            return;
        }

        if (routerContext.url) {
            // redirect as expected
            res.redirect(routerContext.url);

            // stop here
            return;
        }

        const helmet = Helmet.renderStatic();
        const styleTags = sheet.getStyleElement();
        const { css, js } = getManifest(appName);

        const document = (
            <Document
                body={body}
                cssScripts={css}
                helmet={helmet}
                jsScripts={js}
                locale={currentLocale}
                preloadedState={preloadedState}
                publicPath={config.publicPath}
                runtime={runtime}
                styleTags={styleTags}
            />
        );

        const html = `<!doctype html>${renderToStaticMarkup(document)}`;

        res.set({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Xss-Protection': '"1; mode=block"',
            'Content-Security-Policy': cspRule,
        });

        res.send(html);
    } finally {
        sheet.seal();
    }
};

const handler: (options: AppOptions) => Handler = options => async (req, res, next) => {
    try {
        await execute(req, res, options);
    } catch (error) {
        next(error);
    }
};

export default handler;
