import { AppState } from '../store';

export const getAuthToken = (state: AppState) => state.authentication.token;
