import { useEffect, useMemo, useState } from 'react';
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
  updateMeData,
} from '../store/Poster/posterSlice';
import { createNewListItem, ListItems } from '../components/List/List';
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
      data: ao,
      canEdit: false,
      userAdded: false,
    });
  });
};

let count = 0; // TODO remove
const countCheck = () => {
  count++;
  if (count > 5) throw new Error('Hit Count Limit');
};
type UseSpotifyTopArtists<T> = [ListItems<T>, (newTimeRange: string) => void];
export const useTopArtistsCached = () => {
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
        // TODO this logic probably shouldn't be in a finally block, look into removing
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

export const useSpotifyTopArtists = (timeRange: string) => {
  const api = useSpotifyAPI();
  const elog = useErrorLog();
  const [artists, setartists] = useState<SpotifyArtistObject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!api?.topArtists) return;
      try {
        const data = await api.topArtists({ time_range: timeRange });
        if (data instanceof Error) {
          elog(data);
          return;
        }
        setartists(data);
      } catch (e) {
        elog(e);
      }
    };
    fetchData();
  }, [api, elog, timeRange]);
  return artists;
};

export const useMe = () => {
  const me = useTypedSelector(s => s.poster.me);
  const api = useSpotifyAPI();
  const dispatch = useDispatch();
  const log = useAppLog();
  const elog = useErrorLog();

  useEffect(() => {
    const fetchData = async () => {
      if (!api) throw new Error('Expected api');
      log('Using spotify api to fetch me data');
      let meData;
      countCheck(); // TODO Remove once done testing
      try {
        meData = await api.me();
      } catch (e) {
        elog(e);
        return;
      }
      if (!meData) throw new Error('Expected me data');
      if (meData instanceof Error) return;
      dispatch(updateMeData(meData));
    };
    if (!api) return;
    fetchData();
  }, [api, dispatch, elog, log]);

  return me;
};
