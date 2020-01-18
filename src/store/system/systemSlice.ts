import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import produce from "immer"


export type AppErrorType = 'NoSpotifyAccess';
export interface AppError {
  message: string;
  stack: string | undefined;
  name: string;
  type: AppErrorType | null;
  [key: string]: any; 
}
export const nativeToAppError = function(e: Error) {
  const appError: AppError = {} as AppError;
  Object.getOwnPropertyNames(e).forEach(key => {
    appError[key] = (e as any)[key];
  });
  return appError;
};

export interface SpotifyAccessTokenPackage {
  spotifyAccessToken: string;
  spotifyAccessTokenExpire: string;
}

export type GlobalErrorNone = { isError: false };
export type GlobalError = { isError: true, error: AppError}
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
        if (action.payload.spotifyAccessToken !== '') {
          if (draftState.error.isError && draftState.error.error.type === 'NoSpotifyAccess') {
            draftState.error = { isError: false };
          }
        }
      })
    },
    caughtGlobalError(state, action: PayloadAction<Error>) {
      const { payload, } = action;
      const errorType = (payload as any).errorType; 
      const appError: AppError = {
        message: payload.message,
        name: payload.name,
        stack: payload.stack,
        type: (errorType) ? errorType : null,
      }
      return produce(state, draftState => {
        draftState.error = {
          isError: true,
          error: appError,
        }
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
