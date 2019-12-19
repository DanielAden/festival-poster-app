import {SET_SYSTEM_SPOTIFYACCESSTOKEN, SET_SYSTEM_SPOTIFYUSERID, SET_SYSTEM_SPOTIFYACCESSTOKENEXPIRESAT, SET_SYSTEM_ERROR, SET_SYSTEM_ERRORMSG, SET_SYSTEM_ERRORTYPE, SystemActionTypes} from './types'

export function setSystemSpotifyAccessToken(newSpotifyAccessToken: string): SystemActionTypes {
  return {
    type: SET_SYSTEM_SPOTIFYACCESSTOKEN,
    spotifyAccessToken: newSpotifyAccessToken, 
  }
}

export function setSystemSpotifyUserId(newSpotifyUserId: string): SystemActionTypes {
  return {
    type: SET_SYSTEM_SPOTIFYUSERID,
    spotifyUserId: newSpotifyUserId, 
  }
}

export function setSystemSpotifyAccessTokenExpiresAt(newSpotifyAccessTokenExpiresAt: string): SystemActionTypes {
  return {
    type: SET_SYSTEM_SPOTIFYACCESSTOKENEXPIRESAT,
    spotifyAccessTokenExpiresAt: newSpotifyAccessTokenExpiresAt, 
  }
}

export function setSystemError(newError: boolean): SystemActionTypes {
  return {
    type: SET_SYSTEM_ERROR,
    error: newError, 
  }
}

export function setSystemErrorMsg(newErrorMsg: string): SystemActionTypes {
  return {
    type: SET_SYSTEM_ERRORMSG,
    errorMsg: newErrorMsg, 
  }
}

export function setSystemErrorType(newErrorType: string): SystemActionTypes {
  return {
    type: SET_SYSTEM_ERRORTYPE,
    errorType: newErrorType, 
  }
}