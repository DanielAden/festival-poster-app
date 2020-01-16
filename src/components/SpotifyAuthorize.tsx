import React from 'react'
import { useSpotifyAccessToken } from '../spotify/SpotifyAPIHooks'
import { spotifyAuthFromWindow } from '../spotify/SpotifyAuth'
import { Redirect } from 'react-router-dom'
import { useGlobalErrorDispatch, useGlobalError } from '../store/system/useGlobalError'

const redirectHome = () => {
  return <Redirect to='/' />
}

interface Props {
  
}
const SpotifyAuthorize: React.FC<Props> = () => {
  const { accessToken, setAccessToken, setExpiresIn } = useSpotifyAccessToken()
  const { errorType } = useGlobalError();
  const [, clearError] = useGlobalErrorDispatch();
  const tryClearAuthError = () => {
    if (errorType === 'AuthExpiredError') {
      clearError();
    }
  }

  if (accessToken !== '') {
    tryClearAuthError();
    return redirectHome(); 
  }
  const data = spotifyAuthFromWindow();
  console.log('from window: ' + JSON.stringify(data))
  if (data.status !== 'AUTHORIZED') {
    console.log(`Non Authorized status: ${data.status}`)
    console.log(data.error)
    return redirectHome(); 
  }
  if (!data.data) throw new Error('Received authorized status without data')
  const { access_token, expires_in }  = data.data;
  setAccessToken(access_token);
  setExpiresIn(expires_in);
  return redirectHome(); 
}

export default SpotifyAuthorize;
