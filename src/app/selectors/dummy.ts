/* eslint-disable import/prefer-default-export */
import { AppState } from '../store';

export const getDummy = (state: AppState) => state.dummy.value;
