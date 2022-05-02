import { Action, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import store from './store';

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
