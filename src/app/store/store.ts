import { configureStore } from '@reduxjs/toolkit';
import { authenticationReducer, dummyReducer, contextReducer } from '../reducers';

export const reducer = { dummy: dummyReducer, authentication: authenticationReducer, context: contextReducer };

const preloadedState =
    typeof window !== 'undefined'
        ? JSON.parse(document.querySelector('script[data-role="preloaded-state"]').textContent)
        : {};

export function makeStore() {
    return configureStore({ reducer, preloadedState });
}

const store = makeStore();
export type StoreType = typeof store;

export default store;
