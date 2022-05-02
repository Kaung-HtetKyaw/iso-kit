import { AppState } from '../store';

export const getUser = (state: AppState) => state.context.user;
export const isAuthenticated = (state: AppState) => !!state.context.user;
