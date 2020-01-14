import { useState, useEffect, useCallback, useMemo } from "react"
import { spotifyAPIFactory, SpotifyAPI, SpotifyTrackObject } from "./SpotifyAPI"

const accessTokenKey = '__SPOTIFY_ACCESS_TOKEN_KEY__'
const expireTimeKey = '__SPOTIFY_ACCESS_TOKEN_EXPIRE_TIME_KEY__'
const artistsLongTermKey = '__SPOTIFY_ARTISTS_LONG_TERM_KEY__';
const artistsShortTermKey = '__SPOTIFY_ARTISTS_SHORT_TERM_KEY__';
const artistsMediumTermKey = '__SPOTIFY_ARTISTS_MEDIUM_TERM_KEY__';

const nowSeconds = () => {
  return Math.floor(Date.now() / 1000)
}

export const useSpotifyAccessToken = () => {
  const [accessToken, setAccessToken] = useLocalStorage(accessTokenKey, '');
  const [expireTime, setExpireTime] = useLocalStorage(expireTimeKey, -1);
  const [refreshRequired, setRefreshRequired] = useState(false);

  const setExpiresIn = (expiresInSeconds: string) => {
    const expiresInNum = parseInt(expiresInSeconds);
    if (isNaN(expiresInNum)) throw new Error(`Could not convert expiresInSeconds parameter to number: ${expiresInSeconds}`)
    setExpireTime(nowSeconds() + expiresInNum);
  }

  useEffect(() => {
    if (expireTime > -1 && expireTime < nowSeconds()) {
      setRefreshRequired(true);
      setAccessToken('');
    } else if (nowSeconds() > expireTime && refreshRequired) {
      setRefreshRequired(false);
    }
  }, [accessToken, expireTime, refreshRequired, setRefreshRequired, setAccessToken])

  return {
    accessToken,
    refreshRequired,
    setAccessToken,
    setRefreshRequired,
    setExpiresIn,
  };
}

// based on https://usehooks.com/useLocalStorage/
export type UseLocalStorageType<T> = [T, (value: T) => void]
export const useLocalStorage = <T>(key: string, initialValue: T): UseLocalStorageType<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch(e) {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T): void => {
    try {
      const toStore = value; // value instanceof Function ? value(storedValue) : value; //TODO implement ability to pass function to setValue
      setStoredValue(toStore);
      window.localStorage.setItem(key, JSON.stringify(toStore));
    } catch (e) {
      throw e;
    }
  }, [key]);
  
  return [storedValue, setValue];
}

export const useSpotifyAPI = (): SpotifyAPI | null => {
  const { accessToken } = useSpotifyAccessToken();
  const memoedAPI = useMemo(
    () => spotifyAPIFactory( { authToken: accessToken} ), 
    [accessToken],
  )
  return memoedAPI;  
}

export const useTopArtists = () => {
  const [topTracks, setTopTracks] = useLocalStorage<SpotifyTrackObject[]>(artistsLongTermKey, []);
  const api = useSpotifyAPI(); 

  useEffect(() => {
    const fetchData = async () => {
      if (topTracks.length > 0) return; // TODO 
      console.log('Using api to retreive top Artists')
      if (!api) return;
      if (!api.topArtists) throw new Error('Expected topArtists method to exist on spotify api object');
      const topTracksData = await api.topArtists();
      setTopTracks(topTracksData);
    }
    fetchData();
  }, [api, topTracks, setTopTracks])
  return topTracks;
}