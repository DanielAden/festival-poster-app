import {SystemState, SystemActionTypes, SET_SYSTEM_SPOTIFYACCESSTOKEN,SET_SYSTEM_SPOTIFYUSERID,SET_SYSTEM_SPOTIFYACCESSTOKENEXPIRESAT,SET_SYSTEM_ERROR,SET_SYSTEM_ERRORMSG,SET_SYSTEM_ERRORTYPE} from './types'

const initialState: SystemState = {
  spotifyAccessToken: '',
  spotifyUserId: '',
  spotifyAccessTokenExpiresAt: '',
  error: false,
  errorMsg: '',
  errorType: '',
}

export function systemReducer(state = initialState, action: SystemActionTypes): SystemState {
  console.log('Dispatched: ' + JSON.stringify(action))
  switch (action.type) {
    case SET_SYSTEM_SPOTIFYACCESSTOKEN:
      return {...state,
                  spotifyAccessToken: action.spotifyAccessToken}
    case SET_SYSTEM_SPOTIFYUSERID:
      return {...state,
                  spotifyUserId: action.spotifyUserId}
    case SET_SYSTEM_SPOTIFYACCESSTOKENEXPIRESAT:
      return {...state,
                  spotifyAccessTokenExpiresAt: action.spotifyAccessTokenExpiresAt}
    case SET_SYSTEM_ERROR:
      return {...state,
                  error: action.error}
    case SET_SYSTEM_ERRORMSG:
      return {...state,
                  errorMsg: action.errorMsg}
    case SET_SYSTEM_ERRORTYPE:
      return {...state,
                  errorType: action.errorType}
    default:
      return state;
  }
}