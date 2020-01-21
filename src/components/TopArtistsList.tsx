import React from 'react';
import { useSpotifyTopArtists } from '../spotify/SpotifyAPIHooks';
import List, { useReduxList } from './List/List';
import AppSelect, { useAppSelect } from './AppSelect/AppSelect';
import useTypedSelector, { RootState } from '../store/rootReducer';
import { updateArtistList } from '../store/Poster/posterSlice';
import { usePosterSize } from './Poster/Poster';

const listName = 'Top Artists';
const topArtistTROptions = [
  {
    text: 'Last 6 Months',
    value: 'medium_term',
  },
  {
    text: 'All Time',
    value: 'long_term',
  },
  {
    text: '1 Month',
    value: 'short_term',
  },
];

interface Props {}
const TopArtistsList: React.FC<Props> = () => {
  const [, h] = usePosterSize();
  const { setTopArtistsTimeRange } = useSpotifyTopArtists();
  const initialTimeRange = useTypedSelector(s => s.poster.topArtistsTimeRange);
  const [, artistSelectProps] = useAppSelect(
    topArtistTROptions,
    initialTimeRange,
    v => setTopArtistsTimeRange(v),
  );

  const { items, listProps } = useReduxList(
    (state: RootState) => state.poster.artists,
    updateArtistList,
    data => {
      const url = data.images[data.images.length - 1].url;
      return (
        <span>
          <img
            className='img-thumbnail rounded-circle'
            alt={data.name + ' photo'}
            src={url}
            style={{
              height: '75px',
              width: '75px',
              marginRight: '5px',
            }}
          />
          {data.name}
        </span>
      );
    },
  );

  return (
    <div>
      <h3 style={{ display: 'inline-block' }}>{listName}</h3>
      <AppSelect {...artistSelectProps} />
      <div style={{ maxHeight: h, overflowY: 'scroll' }}>
        <List items={items} {...listProps} canSelect />
      </div>
    </div>
  );
};

export default TopArtistsList;
