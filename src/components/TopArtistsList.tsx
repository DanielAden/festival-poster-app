import React from 'react'
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
  const [topArtistsOption, artistSelectProps] = useAppSelect(topArtistOptions, topArtistOptions[0].value)
  const artists = useTopArtists();
  const artistNames = artists.map(a => a.name)
  const [artistsList, artistHandlers] = useList(artistNames, artists.length === 0);
  return (
    <div>
      <h3>{topArtistsOption}</h3>
      <AppSelect {...artistSelectProps} />
      <List name={listName} items={artistsList} {...artistHandlers} canSelect />
    </div>
  )
}

export default TopArtistsList;
