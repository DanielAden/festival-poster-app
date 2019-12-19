import { useState, useEffect } from "react";
import { useGlobalErrorDispatch } from '../store/system/useGlobalError'
import { AuthExpiredError } from '../errors'
import { useSelector } from "react-redux";
import { SystemState } from "../store/system/types";

interface RootState {
  system: SystemState,
}

  /**
   * Hook to utilize information from spotify's api 
   *
   * @param spotifyEPFunction - the async function used to return data from spotify's api
   * @param id - optional id used with the api.  If id is defined as an empty string, the endpoint will not be hit until non-empty
   * @returns potentially null reference to the requested api data 
   *
   */
export function useSpotifyEndpoint<T>(spotifyEPFunction: (accessToken: string, ...args: string[]) => Promise<T> | null,
                                      id?: string, 
): T | null {
  const token = useSelector((state: RootState) => state.system.spotifyAccessToken)
  const [data, setData] = useState<T | null>(null);
  const [errorDispatch] = useGlobalErrorDispatch();
  if (token === '') throw new Error('Attempting to use spotify endpoint before authenticated');
  useEffect(() => {
    async function callFN() {
      if (id !== undefined && id === '') {
        return null;
      }
      let data;
      try {
        data = (id) ? await spotifyEPFunction(token, id) : await spotifyEPFunction(token);
      } catch (e) {
        errorDispatch(e.message, e.type);
        return null;
      }
      if (data) setData(data);
    }
    callFN().catch()
  }, [spotifyEPFunction, id, errorDispatch, token])
  return data;
}