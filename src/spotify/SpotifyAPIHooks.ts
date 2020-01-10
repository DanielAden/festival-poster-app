import { useState, useEffect } from "react"

const accessTokenKey = '__SPOTIFY_ACCESS_TOKEN_KEY__'
const expireTimeKey = '__SPOTIFY_ACCESS_TOKEN_EXPIRE_TIME_KEY__'

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

  const setValue = (value: T): void => {
    try {
      console.log(value);
      const toStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(toStore);
      window.localStorage.setItem(key, JSON.stringify(toStore));
      console.log('after: ' + window.localStorage.getItem(key));
    } catch (e) {
      throw e;
    }
  };

  return [storedValue, setValue];
}