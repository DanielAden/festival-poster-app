import { useState, useEffect, useCallback, useMemo } from 'react';
import { spotifyAPIFactory, SpotifyAPI, SpotifyTrackObject } from './SpotifyAPI';
import { useGlobalErrorDispatch } from '../store/system/useGlobalError';
import { createAuthExpiredError } from '../errors';

const accessTokenKey = '__SPOTIFY_ACCESS_TOKEN_KEY__';
const expireTimeKey = '__SPOTIFY_ACCESS_TOKEN_EXPIRE_TIME_KEY__';
const topArtistsKey = '__SPOTIFY_TOP_ARTISTS__';

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
export type UseLocalStorage<T> = [T, (value: T) => void]
function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorage<T> {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      if (value instanceof Function) {
        setStoredValue((oldValue: T) => {
          const toStore = value(oldValue);
          window.localStorage.setItem(key, JSON.stringify(toStore));
          return toStore;
        })
      } else {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
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

let count = 0;
export const useSpotifyTopArtists = (time_range: string = 'medium_term') => {
  const [topTracks, setTopTracks] = useLocalStorage<SpotifyTrackObject[]>(topArtistsKey, []);
  const api = useSpotifyAPI(); 
  const [errorDispatch, ] = useGlobalErrorDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (!api) {
        const e = createAuthExpiredError('Unable to access Spotify API');
        errorDispatch(e.message, e.type);
        return;
      }
      if (!api.topArtists) throw new Error('Expected topArtists method to exist on spotify api object');
      count++;
      if (count > 5) throw new Error('Max Count Reached')
      console.log('Using api to retreive top Artists for range ' + time_range)
      try {
        const topTracksData = await api.topArtists({ time_range });
        setTopTracks(topTracksData);
      } catch(e) {
        console.log('Caught Error ' + e.message + e.type)
        errorDispatch(e.message, e.type);
      }
    }
    fetchData();
  }, [api, setTopTracks, time_range, errorDispatch])
  return topTracks;
}
