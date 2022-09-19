import { configureStore } from '@reduxjs/toolkit';
import App from '../../../app/App';
import { reducer } from '../../../app/store/store';
import renderApplication from './core';

export default renderApplication({
    baseRoute: '',
    appName: 'app',
    App,
    store: configureStore({ reducer, preloadedState: { dummy: { value: 'This is preloaded from server' } } }),
});
