import React, { useEffect } from 'react'
import { useSpotifyTopArtists } from '../spotify/SpotifyAPIHooks'
import List, { useReduxList, createNewListItem } from './List/List'
import AppSelect, { useAppSelect } from './AppSelect/AppSelect'
import { RootState } from '../store/rootReducer'
import { updateArtistList } from '../store/Poster/posterSlice'


const listName = 'My Top Artists'

const topArtistOptions = [
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
  const [selected, artistSelectProps] = useAppSelect(topArtistOptions, topArtistOptions[0].value)
  const artists = useSpotifyTopArtists(selected);

  const artistsSelectorFN = (state: RootState) => state.poster.artists;
  const [artistsList, setArtistsList, artistListHook] = useReduxList(artistsSelectorFN, updateArtistList);

  useEffect(() => {
    const artistNames = artists.map(a => a.name)
    const artistListItems = artistNames.map((artistName) => {
      return createNewListItem({
        text: artistName,
        isSelected: true,
        canEdit: false,
        userAdded: false,
      })
    })
    setArtistsList(artistListItems);
  }, [selected, artists, setArtistsList])

  return (
    <div>
      <AppSelect {...artistSelectProps} />
      <List name={listName} items={artistsList} {...artistListHook} canSelect />
    </div>
  )
}

export default TopArtistsList;
