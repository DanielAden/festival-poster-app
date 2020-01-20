import React from 'react';
import { spotifyAuthFromWindow } from '../spotify/SpotifyAuth';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { accessTokenUpdated } from '../store/system/systemSlice';

const redirectHome = () => {
  return <Redirect to='/' />;
};

interface Props {}
const SpotifyAuthorize: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const authData = spotifyAuthFromWindow();

  if (authData.status !== 'AUTHORIZED') {
    console.log(`Non Authorized status: ${authData.status}`);
    console.log(authData.error);
    return redirectHome();
  }

  if (!authData.data)
    throw new Error('Received authorized status without data');
  const { access_token, expires_in } = authData.data;
  dispatch(
    accessTokenUpdated({
      spotifyAccessToken: access_token,
      spotifyAccessTokenExpire: expires_in,
    }),
  );
  return redirectHome();
};

export default SpotifyAuthorize;
