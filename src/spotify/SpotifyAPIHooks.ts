import { useState, useEffect, useCallback, useMemo } from 'react';
import { spotifyAPIFactory, SpotifyAPI, SpotifyTrackObject } from './SpotifyAPI';

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
      // let valueToStore = value instanceof Function ? value(storedValue) : value;
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

export const useTopArtists = (time_range: string = 'medium_term') => {
  const [topTracks, setTopTracks] = useLocalStorage<SpotifyTrackObject[]>(topArtistsKey, []);
  const api = useSpotifyAPI(); 

  useEffect(() => {
    const fetchData = async () => {
      console.log('Using api to retreive top Artists for range ' + time_range)
      if (!api) return;
      if (!api.topArtists) throw new Error('Expected topArtists method to exist on spotify api object');
      const topTracksData = await api.topArtists({ time_range });
      setTopTracks(topTracksData);
    }
    fetchData();
  }, [api, setTopTracks, time_range])
  return topTracks;
}
