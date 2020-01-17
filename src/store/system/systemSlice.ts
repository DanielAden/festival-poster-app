import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import produce from "immer"

export interface SpotifyAccessTokenPackage {
  spotifyAccessToken: string;
  spotifyAccessTokenExpire: string;
}

export type GlobalErrorNone = { isError: false };
export type GlobalError = { isError: true, msg: string, type: string }
export type GlobalErrorPackage = GlobalError | GlobalErrorNone; 

export interface SystemState extends SpotifyAccessTokenPackage {
  error: GlobalErrorPackage,
}

const initialState: SystemState = {
  spotifyAccessToken: '',
  spotifyAccessTokenExpire: '',
  error: { isError: false }
}

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    accessTokenUpdated(state, action: PayloadAction<SpotifyAccessTokenPackage>) {
      return produce(state, draftState => {
        draftState.spotifyAccessToken = action.payload.spotifyAccessToken;
        draftState.spotifyAccessTokenExpire = action.payload.spotifyAccessTokenExpire;
      })
    },
    caughtGlobalError(state, action: PayloadAction<GlobalError>) {
      return produce(state, draftState => {
        draftState.error = action.payload;
      })
    },
    clearGlobalError(state) {
      return produce(state, draftState => {
        draftState.error = { isError: false };
      })
    },
  }
})

export const { accessTokenUpdated, caughtGlobalError, clearGlobalError } = systemSlice.actions;
export default systemSlice.reducer;
