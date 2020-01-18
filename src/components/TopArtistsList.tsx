import React from 'react'
import { useSpotifyTopArtists } from '../spotify/SpotifyAPIHooks'
import List, { useReduxList, } from './List/List'
import AppSelect, { useAppSelect } from './AppSelect/AppSelect'
import useTypedSelector, { RootState } from '../store/rootReducer'
import { updateArtistList } from '../store/Poster/posterSlice'
import { usePosterSize } from './Poster/PosterThemes'

const listName = 'My Top Artists'
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
    value: 'short_term'
  },
]

interface Props {

}
const TopArtistsList: React.FC<Props> = () => {
  const [, h] = usePosterSize();
  const { setTopArtistsTimeRange } = useSpotifyTopArtists();
  const initialTimeRange = useTypedSelector(s => s.poster.topArtistsTimeRange)
  const [, artistSelectProps] = useAppSelect(topArtistTROptions, initialTimeRange, (v) => setTopArtistsTimeRange(v))

  const { items, listProps } = useReduxList(
    (state: RootState) => state.poster.artists, 
    updateArtistList,
  );


  return (
    <div>
      <AppSelect {...artistSelectProps} />
      <div style={{maxHeight: h, overflowY: 'scroll'}}>
        <List name={listName} items={items} {...listProps} canSelect />
      </div>
    </div>
  )
}

export default TopArtistsList;
