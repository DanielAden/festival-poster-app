import React from 'react'
import { getSpotifyAuth, constructSpotifyAuthURL } from '../spotify/Auth';
import { useDispatch } from 'react-redux';
import { setSystemSpotifyAccessToken } from '../store/system/actions';
import { Redirect } from 'react-router-dom';
import { Input } from 'reactstrap'

interface Props {
  
}
const SpotifyAuth: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const authData = getSpotifyAuth()
  if (authData.status === 'AUTHORIZED' && authData.data) {
    const data = authData.data;
    dispatch(setSystemSpotifyAccessToken(data.access_token));
    return (
      <Redirect to={{
        pathname: '/',
      }} />
    )
  }

  return (
    <div>
      <h1>Authroize Spotify</h1>
      <a href={constructSpotifyAuthURL()}>Authorize Spotify</a>
      <form>
        <label>
          Spotify User Id: 
          <Input type="text"/>
        </label>
        <Input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default SpotifyAuth;
