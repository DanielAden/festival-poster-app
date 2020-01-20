import useTypedSelector from '../rootReducer';

const nowSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

type UseSpotifyAccessToken =
  | { status: 'NONE' }
  | { status: 'EXPIRED' }
  | { status: 'VALID'; accessToken: string };
const useSpotifyAccessToken = (): UseSpotifyAccessToken => {
  const accessToken = useTypedSelector(s => s.system.spotifyAccessToken);
  const expire = useTypedSelector(s => s.system.spotifyAccessToken);
  if (accessToken === '' && expire === '') return { status: 'NONE' };
  if (accessToken === '' || expire === '')
    throw new Error('Spotify access token/expire in invalid state');

  const expireTime = parseInt(expire, 10);
  if (expireTime < nowSeconds()) return { status: 'EXPIRED' };
  return {
    status: 'VALID',
    accessToken,
  };
};

export default useSpotifyAccessToken;
