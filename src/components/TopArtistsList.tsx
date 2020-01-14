import React from 'react'
import { useTopArtists } from '../spotify/SpotifyAPIHooks'
import List, {useList} from './List/List'

const listName = 'My Top Artists'

interface Props {
  
}
const TopArtistsList: React.FC<Props> = () => {
  const artists = useTopArtists();
  const artistNames = artists.map(a => a.name)
  const [artistsList, artistHandlers] = useList(artistNames, artists.length === 0);
  return (
    <div>
      <List name={listName} items={artistsList} {...artistHandlers} canSelect />
    </div>
  )
}

export default TopArtistsList;
