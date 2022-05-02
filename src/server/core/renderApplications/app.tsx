import { configureStore } from '@reduxjs/toolkit';
import App from '../../../app/App';
import { reducer } from '../../../app/store/store';
import config from '../config';
import renderApplication from './core';

export default renderApplication({
    baseRoute: '',
    manifest: { bundle: 'app', name: 'manifest' },
    publicPath: config.publicPath,
    App,
    store: configureStore({ reducer, preloadedState: { dummy: { value: 'This is preloaded from server' } } }),
});
