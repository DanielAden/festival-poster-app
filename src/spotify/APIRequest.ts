import { getSpotifyAuth } from './Auth';
import { AuthExpiredError } from '../errors';

export const SPOTIFY_API_HOST = 'https://api.spotify.com'
export const SPOTIFY_VERSION = 'v1'

export function apiurl(...endpoints: string[]): string {
  let epList = [SPOTIFY_VERSION, ...endpoints]
  let endpointString = epList.join('/');
  return new URL(endpointString, SPOTIFY_API_HOST).href
}

function handleError(e: any): never {
  throw e;
}

export async function spotifyFetch(access_token: string, url: string) {
  let req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).catch(handleError);
  if (!req.ok) {
    if (req.status === 401) throw new AuthExpiredError(`Fetch for URL ${url} returned not ok status.  Status: ${req.status}`);
    throw new Error(`Fetch for URL ${url} returned not ok status.  Status: ${req.status}`)
  }
  if (req.status !== 200) {
    throw new Error(`Fetch for URL ${url} returned a status of ${req.status}`)
  }
  let json = await req.json().catch(handleError)
  return json;
}

async function spotifyGETHelper<T>(accessToken: string, ...urlParams: string[]): Promise<T> {
  const url = apiurl(...urlParams);
  const data = await spotifyFetch(accessToken, url).catch(handleError);
  if (!data.hasOwnProperty('items')) {
    throw new Error(`Returned paging object does not contain items field.  Url: ${url}`)
  }
  return data.items; 
}

interface SpotifyUserObject {
  country: string;
  display_name: string;
  email: string;
  href: string;
  id: string;
  product: string;
  type: string;
  uri: string;
}
export async function spotifyMe(accessToken: string): Promise<SpotifyUserObject> {
  const url = apiurl('me');
  const data = await spotifyFetch(accessToken, url);
  return data;
}

export interface SpotifyPlaylistObject {
  description: string;
  href: string;
  id: string;
  name: string;
  tracks: string;
  type: string;
  uri: string;
}
export interface SpotifyPagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string;
  offset: string;
  previous: string;
  total: number;
}
export async function spotifyPlaylists(accessToken: string): Promise<SpotifyPlaylistObject[]> {
  return spotifyGETHelper(accessToken, 'me', 'playlists');
}

export interface SpotifyPlaylistTrackObject {
  track: SpotifyTrackObject;
}
export async function spotifyTracksFromPlaylist(accessToken: string, playlist_id: string): Promise<SpotifyTrackObject[]> {
  const res = await spotifyGETHelper<SpotifyPlaylistTrackObject[]>(accessToken, 'playlists', playlist_id, 'tracks');
  // Strip off the PlaylistTrackObject information
  return res.map(playlistTrackObject => playlistTrackObject.track)
}

export function extractArtistsFromTracks(tracks: SpotifyTrackObject[]): string[] {
  let artistsSet = new Set<string>();
  tracks.forEach(track => {
    artistsSet.add(track.artists[0].name)
  });
  return [...artistsSet];
}


export interface SpotifyAlbumObjectSimple {
  album_type: 'album' | 'single' | 'compilation';
  artists: SpotifyArtistObjectSimple[];
  href: string; // A link to the Web API endpoint providing full details of the album.
  name: string;
  release_date: string;
  type: 'album';
  uri: string;
}

export interface SpotifyArtistObjectSimple {
  href: string; // A link to the Web API endpoint providing full details of the artist.
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface SpotifyTrackObject {
  album: SpotifyAlbumObjectSimple; 
  artists: SpotifyArtistObjectSimple[];
  duration_ms: number;
  href: string; // A link to the Web API endpoint providing full details of the track.
  id: string;  
  name: string;  
  popularity: number;
  track_number: number;
  type: 'track';
  uri: string;
}