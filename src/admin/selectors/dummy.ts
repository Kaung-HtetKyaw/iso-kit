import { AppState } from '../store';

// eslint-disable-next-line import/prefer-default-export
export const getDummy = (state: AppState) => state.dummy.value;
