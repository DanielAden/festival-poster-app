import React from 'react'
import SpotifyInfoCapturePanel from './SpotifyInfoCapturePanel';
import { useSpotifyAccessToken } from '../spotify/SpotifyAPIHooks';

interface Props {
  
}

const Home: React.FC<Props> = () => {
  const { accessToken } = useSpotifyAccessToken();
  return (
    <div>
      <SpotifyInfoCapturePanel />
      <h3>Token: {accessToken}</h3>
    </div>
  )
}

export default Home;
