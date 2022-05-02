import { configureStore } from '@reduxjs/toolkit';
import App from '../../../admin/App';
import { reducer } from '../../../admin/store/store';
import config from '../config';
import renderApplication from './core';

export default renderApplication({
    baseRoute: '/admin',
    manifest: { bundle: 'admin', name: 'admin-manifest' },
    publicPath: config.adminPublicPath,
    App,
    store: configureStore({ reducer, preloadedState: { dummy: { value: 'This is preloaded from server' } } }),
});
