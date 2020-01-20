import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import produce from 'immer';
import { toStorable, AppErrorStorable } from '../../error';

export interface SpotifyAccessTokenPackage {
  spotifyAccessToken: string;
  spotifyAccessTokenExpire: string;
}

export type GlobalErrorNone = { isError: false };
export type GlobalError = { isError: true; error: AppErrorStorable };
export type GlobalErrorPackage = GlobalError | GlobalErrorNone;

export interface SystemState extends SpotifyAccessTokenPackage {
  error: GlobalErrorPackage;
}

const initialState: SystemState = {
  spotifyAccessToken: '',
  spotifyAccessTokenExpire: '',
  error: { isError: false },
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    accessTokenUpdated(
      state,
      action: PayloadAction<SpotifyAccessTokenPackage>,
    ) {
      return produce(state, draftState => {
        draftState.spotifyAccessToken = action.payload.spotifyAccessToken;
        draftState.spotifyAccessTokenExpire =
          action.payload.spotifyAccessTokenExpire;
        if (action.payload.spotifyAccessToken !== '') {
          if (
            draftState.error.isError &&
            draftState.error.error.type === 'NoSpotifyAccess'
          ) {
            draftState.error = { isError: false };
          }
        }
      });
    },
    caughtGlobalError(state, action: PayloadAction<Error>) {
      return produce(state, draftState => {
        draftState.error = {
          isError: true,
          error: toStorable(action.payload),
        };
      });
    },
    clearGlobalError(state) {
      return produce(state, draftState => {
        draftState.error = { isError: false };
      });
    },
  },
});

export const {
  accessTokenUpdated,
  caughtGlobalError,
  clearGlobalError,
} = systemSlice.actions;
export default systemSlice.reducer;
