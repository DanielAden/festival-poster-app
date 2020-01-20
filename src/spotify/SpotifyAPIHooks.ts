import { useEffect, useMemo } from 'react';
import {
  spotifyAPIFactory,
  SpotifyAPI,
  SpotifyArtistObject,
} from './SpotifyAPI';
import { useDispatch } from 'react-redux';
import useSpotifyAccessToken from '../store/system/useSpotifyAccessToken';
import useTypedSelector from '../store/rootReducer';
import {
  updateArtistList,
  topArtistsTimeRangeUpdated,
} from '../store/Poster/posterSlice';
import { createNewListItem, ListItem } from '../components/List/List';
import { useErrorLog, useAppLog } from '../AppLog';
import { AppError } from '../error';

export const useSpotifyAPI = (): SpotifyAPI | null => {
  const tokenData = useSpotifyAccessToken();
  const elog = useErrorLog();
  let accessToken = '';
  if (tokenData.status === 'NONE' || tokenData.status === 'EXPIRED') {
    const e = new AppError(
      `Spotify Access token status not valid.  status: ${tokenData.status}`,
    );
    elog(e, 'NoSpotifyAccess');
  } else {
    accessToken = tokenData.accessToken;
  }
  const memoedAPI = useMemo(() => {
    if (accessToken === '') return null;
    return spotifyAPIFactory({ authToken: accessToken });
  }, [accessToken]);

  return memoedAPI;
};

const artistObjectsToListItems = (artistObjects: SpotifyArtistObject[]) => {
  return artistObjects.map(ao => {
    return createNewListItem({
      isSelected: true,
      text: ao.name,
      canEdit: false,
      userAdded: false,
    });
  });
};

let count = 0; // TODO remove
type UseSpotifyTopArtists = [ListItem[], (newTimeRange: string) => void];
export const useSpotifyTopArtists = () => {
  const timeRange = useTypedSelector(s => s.poster.topArtistsTimeRange);
  const topArtists = useTypedSelector(s => s.poster.artists);

  const api = useSpotifyAPI();
  const dispatch = useDispatch();
  const log = useAppLog();
  const elog = useErrorLog();

  const setTopArtistsTimeRange = (newTimeRange: string) => {
    dispatch(topArtistsTimeRangeUpdated(newTimeRange));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!api?.topArtists)
        throw new Error(
          'Expected topArtists method to exist on spotify api object',
        );
      count++;
      if (count > 5) throw new Error('Max Count Reached');
      log('Using api to retreive top Artists for range ' + timeRange);
      let topArtistsData;
      try {
        topArtistsData = await api.topArtists({ time_range: timeRange });
      } catch (e) {
        elog(e, 'NoSpotifyAccess');
      } finally {
        if (!topArtistsData) throw new AppError('Expected top artists data');
        if (topArtistsData instanceof Error) {
          elog(topArtistsData);
          return;
        }
        const topArtistsList = artistObjectsToListItems(topArtistsData);
        dispatch(updateArtistList(topArtistsList));
      }
    };
    if (!api) return;
    fetchData();
  }, [dispatch, log, elog, api, timeRange]);

  return { topArtists, setTopArtistsTimeRange };
};
