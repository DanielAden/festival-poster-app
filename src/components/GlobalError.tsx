import React from 'react'
import { useGlobalError, useGlobalErrorDispatch } from '../store/system/useGlobalError'
import { useDispatch } from 'react-redux';
import { setSystemSpotifyAccessToken, setSystemSpotifyAccessTokenExpiresAt } from '../store/system/actions';

interface Props {
  
}
const GlobalError: React.FC<Props> = ( { children }) => {
  const { errorMsg, errorType, isError } = useGlobalError();
  const [, clearError] = useGlobalErrorDispatch();
  const dispatch = useDispatch()
  let errorBanner = null;
  if (!isError) {
    errorBanner = null;
  } else if (errorType === 'AuthExpiredError') {
    dispatch(setSystemSpotifyAccessToken(''));
    dispatch(setSystemSpotifyAccessTokenExpiresAt(''));
    clearError();
  } else {
    errorBanner = (!isError) ? null : (
      <div>
        <h1>{`ERROR: ${errorMsg}`}</h1>
        <h2>{`Type: ${errorType}`}</h2>
      </div>
    )
  }
  return (
    <div>
      {errorBanner}
      {children}      
    </div>
  )
}

export default GlobalError
