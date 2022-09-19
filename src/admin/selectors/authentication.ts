import { AppState } from '../store';

// eslint-disable-next-line import/prefer-default-export
export const getAuthToken = (state: AppState) => state.authentication.token;
