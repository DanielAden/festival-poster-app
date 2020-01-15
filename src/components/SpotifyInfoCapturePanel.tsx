import React from 'react'
import { constructSpotifyAuthURL } from '../spotify/SpotifyAuth';

// const centerContent = 'justify-content-md-center';
// const uriFormText = `Enter a Spotify User URI`;
// const userIdFormat = 'spotify:user:yourid';
// const invalidURIMsg = `Invalid Spotify URI. Format should be '${userIdFormat}'`;
// const testURI = 'spotify:user:1238922402'

// function parseUserIdFromURI(uri: string) {
//   const uriParts = uri.split(':')
//   if (uriParts.length !== 3) return;
//   if (uriParts[0] !== 'spotify' || uriParts[1] !== 'user') return;
//   const userId = uriParts[2];
//   if (userId === '') return;
//   return userId;
// }

interface Props {
  
}
const SpotifyInfoCapturePanel: React.FC<Props> = () => {
  return (
        <a href={constructSpotifyAuthURL()}>Authorize Spotify</a>
  )
}

export default SpotifyInfoCapturePanel;
