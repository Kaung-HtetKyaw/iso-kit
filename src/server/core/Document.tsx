import { ReactElement } from 'react';
import { HelmetData } from 'react-helmet';
import { attachPublicPath } from '../utils';
import { RuntimeConfig, AppState } from './renderApplications/core';

type DocumentProps = {
    htmlAttrs?: { [prop: string]: any };
    bodyAttrs?: { [prop: string]: any };
    body: string;
    helmet: HelmetData;
    styleTags?: ReactElement[];
    jsScripts?: string[];
    cssScripts?: string[];
    runtime: RuntimeConfig;
    preloadedState: AppState;
    locale: string;
    publicPath?: string;
};

const Document = ({
    htmlAttrs,
    bodyAttrs,
    helmet,
    body,
    styleTags,
    cssScripts,
    jsScripts,
    runtime,
    locale,
    publicPath,
    preloadedState,
}: DocumentProps) => (
    <html lang={locale} {...htmlAttrs}>
        <head>
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
            {cssScripts?.map((url, index) => (
                <link
                    // eslint-disable-next-line react/no-array-index-key
                    key={index.toString()}
                    href={attachPublicPath(url, publicPath)}
                    rel="stylesheet"
                    type="text/css"
                />
            ))}
            {styleTags}
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: JSON.stringify(runtime) }}
                data-role="runtime-config"
                type="application/json"
            />
            <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: JSON.stringify(preloadedState) }}
                data-role="preloaded-state"
                type="application/json"
            />
        </head>
        <body {...bodyAttrs}>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: body }} id="root" />
            {jsScripts?.map((url, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <script key={index.toString()} src={attachPublicPath(url, publicPath)} type="application/javascript" />
            ))}
        </body>
    </html>
);

export default Document;
