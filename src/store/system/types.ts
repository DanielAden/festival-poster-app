
export interface SystemState {
  spotifyAccessToken: string; // ''
  spotifyUserId: string; // ''
  spotifyAccessTokenExpiresAt: string; // '',
  error: boolean; // false 
  errorMsg: string; // ''
  errorType: string; // ''
}
export const SET_SYSTEM_SPOTIFYACCESSTOKEN = 'SET_SYSTEM_SPOTIFYACCESSTOKEN';
export interface SetSpotifyAccessTokenAction {
  type: typeof SET_SYSTEM_SPOTIFYACCESSTOKEN;
  spotifyAccessToken: string;
}
export const SET_SYSTEM_SPOTIFYUSERID = 'SET_SYSTEM_SPOTIFYUSERID';
export interface SetSpotifyUserIdAction {
  type: typeof SET_SYSTEM_SPOTIFYUSERID;
  spotifyUserId: string;
}
export const SET_SYSTEM_SPOTIFYACCESSTOKENEXPIRESAT = 'SET_SYSTEM_SPOTIFYACCESSTOKENEXPIRESAT';
export interface SetSpotifyAccessTokenExpiresAtAction {
  type: typeof SET_SYSTEM_SPOTIFYACCESSTOKENEXPIRESAT;
  spotifyAccessTokenExpiresAt: string;
}
export const SET_SYSTEM_ERROR = 'SET_SYSTEM_ERROR';
export interface SetErrorAction {
  type: typeof SET_SYSTEM_ERROR;
  error: boolean;
}
export const SET_SYSTEM_ERRORMSG = 'SET_SYSTEM_ERRORMSG';
export interface SetErrorMsgAction {
  type: typeof SET_SYSTEM_ERRORMSG;
  errorMsg: string;
}
export const SET_SYSTEM_ERRORTYPE = 'SET_SYSTEM_ERRORTYPE';
export interface SetErrorTypeAction {
  type: typeof SET_SYSTEM_ERRORTYPE;
  errorType: string;
}
export type SystemActionTypes = SetSpotifyAccessTokenAction | SetSpotifyUserIdAction | SetSpotifyAccessTokenExpiresAtAction | SetErrorAction | SetErrorMsgAction | SetErrorTypeAction;
