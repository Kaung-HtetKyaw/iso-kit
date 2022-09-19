import { configureStore } from '@reduxjs/toolkit';
import App from '../../../admin/App';
import { reducer } from '../../../admin/store/store';
import renderApplication from './core';

export default renderApplication({
    baseRoute: '/admin',
    appName: 'admin',
    App,
    store: configureStore({ reducer, preloadedState: { dummy: { value: 'This is preloaded from server' } } }),
});
