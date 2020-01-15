import React, { useEffect } from 'react'
import { useTopArtists } from '../spotify/SpotifyAPIHooks'
import List, { useList } from './List/List'
import AppSelect, { useAppSelect } from './AppSelect/AppSelect'

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
  const artists = useTopArtists(selected);
  const [artistsList, setArtistsList, artistListHook] = useList();

  useEffect(() => {
    const artistNames = artists.map(a => a.name)
    setArtistsList(artistNames);
  }, [selected, artists, setArtistsList])
  return (
    <div>
      <AppSelect {...artistSelectProps} />
      <List name={listName} items={artistsList} {...artistListHook} canSelect />
    </div>
  )
}

export default TopArtistsList;
