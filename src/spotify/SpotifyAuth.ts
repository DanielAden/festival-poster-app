const client_id = 'f775b626d4784dfba4491742d5453d55'; // Your client id
const redirect_uri = 'http://localhost:3000/authenticate'; // Your redirect uri
const scope = 'playlist-read-collaborative'
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_ACCESS_TOKEN_FIELD = 'access_token';
const SPOTIFY_TOKEN_TYPE_FIELD = 'token_type';
const SPOTIFY_EXPIRES_IN_FIELD = 'expires_in';

const authParams = {
  client_id,
  response_type: 'token',
  redirect_uri,
  scope,
}

export function constructSpotifyAuthURL() {
  const queryParamsList = [];
  for (let [k, v] of Object.entries(authParams)) {
    queryParamsList.push(`${k}=${v}`)
  }
  const paramsString = queryParamsList.join('&');
  return `${SPOTIFY_AUTH_URL}?${paramsString}`;
}

interface SpotifyAuthData {
  access_token: string;
  token_type: string;
  expires_in: string;
  state?: string;
} 

let MEMOED_AUTH_DATA: SpotifyAuthData | undefined; 

type AuthDataStatus = 'AUTHORIZED' | 'NOT_AUTHORIZED' | 'ACCESS_DENIED' | 'ERROR';
export function spotifyAuthFromWindow(): { status: AuthDataStatus, data?: SpotifyAuthData, error?: string}  {
  if (MEMOED_AUTH_DATA) {
    return {
      status: 'AUTHORIZED',
      data: MEMOED_AUTH_DATA,
    }
  }
  const data: any = {};
  const urlList = window.location.href.split('#')
  if (urlList.length !== 2) return { status: 'NOT_AUTHORIZED', } // no hash fragment 
  const queryList = urlList[1].split('&');
  for (let queryString of queryList) {
    let [k, v] = queryString.split('=');
    data[k] = v;
  }

  if (data.hasOwnProperty('error')) {
    return { status: 'ACCESS_DENIED' }
  }

  let error = '';
  if (!data.hasOwnProperty(SPOTIFY_ACCESS_TOKEN_FIELD)) {
    error = `Hash fragment does not contain field: ${SPOTIFY_ACCESS_TOKEN_FIELD}`
  }
  if (!data.hasOwnProperty(SPOTIFY_EXPIRES_IN_FIELD)) {
    error = `Hash fragment does not contain field: ${SPOTIFY_EXPIRES_IN_FIELD}`
  }
  if (!data.hasOwnProperty(SPOTIFY_TOKEN_TYPE_FIELD)) {
    error = `Hash fragment does not contain field: ${SPOTIFY_TOKEN_TYPE_FIELD}`
  }
  if (error !== '') {
    return {
      status: 'ERROR',
      error
    }
  }

  return {
    status: 'AUTHORIZED',
    data
  }
}
