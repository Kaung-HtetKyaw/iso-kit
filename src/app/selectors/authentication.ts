/* eslint-disable import/prefer-default-export */
import { AppState } from '../store';

export const getAuthToken = (state: AppState) => state.authentication.token;
