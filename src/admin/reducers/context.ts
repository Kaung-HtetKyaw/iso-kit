import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import persistState from '../../shared/reducer/persistState';
import { UserFullDataFragment } from '../api';

export type ContextState = { user: UserFullDataFragment | null };

const initialState: ContextState = { user: null };

const slice = createSlice({
    name: 'context',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserFullDataFragment>) => ({ ...state, user: action.payload }),
    },
});

export const { setUser } = slice.actions;

export default persistState('context', slice.reducer);
