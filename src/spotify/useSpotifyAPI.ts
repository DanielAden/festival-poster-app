import { useState, useEffect, useCallback } from "react";
import { useGlobalErrorDispatch } from '../store/system/useGlobalError'
import { useSelector } from "react-redux";
import { SystemState } from "../store/system/types";
import { spotifyAPIFactory, SpotifyAPICallStrings } from './SpotifyAPI'

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
export function useSpotifyEndpoint<T>(apiCall: SpotifyAPICallStrings, ...callArgs: string[]): T | null {

  const [data, setData] = useState<any>(null);
  const authToken = useSelector((state: RootState) => state.system.spotifyAccessToken)
  const userId = useSelector((state: RootState) => state.system.spotifyUserId)
  const [errorDispatch] = useGlobalErrorDispatch();
  const getApi = useCallback(() => spotifyAPIFactory({ authToken, userId }), [authToken, userId])
  const api = getApi()?.api;
  useEffect(() => {
    async function callFN() {
      let data;
      try {
        if (api === undefined) {
          throw new Error('Spotify User Id or Access Token was not provided')
        }
        switch (apiCall) {
          case 'getPlaylistTracks':
            if (callArgs.length < 1) throw new Error(`must provide playlist id for api endpoint ${apiCall}`)
            data = api.getPlaylistTracks(callArgs[0]);
            break;
          case 'me':
            data = api.me();
            break;
          case 'playlists':
            data = api.getPlaylists();
            break;
        }
      } catch (e) {
        errorDispatch(e.message, e.type);
        return null;
      }
      if (data) setData(data);
    }
    callFN();
  }, [apiCall, callArgs, errorDispatch, api])
  return data;
}