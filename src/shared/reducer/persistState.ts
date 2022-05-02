import { isEmpty } from 'lodash/fp';
import { Action, Reducer } from 'redux';

export const getSessionItem = (storageKey: string) => {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(storageKey);
    }

    return undefined;
};

export const getInitialState = <S>(storageKey: string): S | undefined => {
    const persistedState = getSessionItem(storageKey);

    // parse it if exists
    const initialState = persistedState ? (JSON.parse(persistedState) as S) : undefined;

    return initialState;
};

const persistState = <S, A extends Action>(storageKey: string, reducer: Reducer<S, A>): Reducer<S, A> => {
    let previousState: S;

    // when redux is initializing the store
    const reloadState = (action: A) => {
        const initialState = getInitialState(storageKey) as S;
        previousState = reducer(initialState, action);

        return previousState;
    };

    // when redux is updating the store
    const updateState = (state: S, action: A) => {
        const newState = reducer(state, action);

        // only consider persisting if shallow comparison of two states is not equal
        // and the state we want to update is not undefined
        if (newState !== previousState && state !== undefined && typeof window !== 'undefined') {
            // persist only if the new state has value
            if (!isEmpty(newState)) {
                sessionStorage.setItem(storageKey, JSON.stringify(newState));
            } else {
                sessionStorage.removeItem(storageKey);
            }
        }

        return newState;
    };

    return (state, action) => {
        if (state === undefined) {
            return reloadState(action);
        }

        return updateState(state, action);
    };
};

export default persistState;
