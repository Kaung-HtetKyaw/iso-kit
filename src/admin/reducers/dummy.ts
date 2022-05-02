import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import persistState from '../../shared/reducer/persistState';

export type DummyInitialState = { value: string };

const initialState: DummyInitialState = { value: 'This is Dummy' };

const slice = createSlice({
    name: 'dummy',
    initialState,
    reducers: {
        setDummy: (state, action: PayloadAction<string>) => ({ ...state, value: action.payload }),
    },
});

export const { setDummy } = slice.actions;

export default persistState('dummy', slice.reducer);
