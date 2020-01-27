import React from 'react';
import { useTopArtistsCached } from '../spotify/SpotifyAPIHooks';
import List, { useReduxList } from './List/List';
import AppSelect, { useAppSelect } from './AppSelect/AppSelect';
import useTypedSelector, { RootState } from '../store/rootReducer';
import { updateArtistList } from '../store/Poster/posterSlice';

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
  const { setTopArtistsTimeRange } = useTopArtistsCached();
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
            className=''
            alt={data.name + ' photo'}
            src={url}
            style={{
              height: '50px',
              width: '50px',
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
      <List items={items} {...listProps} canSelect />
    </div>
  );
};

export default TopArtistsList;
