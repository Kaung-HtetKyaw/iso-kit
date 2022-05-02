import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import persistState from '../../shared/reducer/persistState';

export type AuthenticationInitialState = { token: string };

const initialState: AuthenticationInitialState = { token: '' };

const slice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setAuthenticationToken: (state, action: PayloadAction<string>) => ({ ...state, token: action.payload }),
    },
});

export const { setAuthenticationToken } = slice.actions;

export default persistState('authentication', slice.reducer);
