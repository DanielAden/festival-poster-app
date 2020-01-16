import React from 'react'
import { useSelector } from 'react-redux'
import { ListItem } from '../List/List'
import './ArtistBlock.css'


const dot = 9679;

interface Props {
  
}
const ArtistBlock: React.FC<Props> = () => {
  const artists = useSelector((s: any) => s.artistList.artists as ListItem[])

  const itemsToBlock = () => {
    const artistNames = artists.filter(a => a.isSelected).map(a => a.text);
    const els = artistNames.map((a, i) => {
      return <span>{a}{(i!==artistNames.length - 1) ? String.fromCharCode(dot) : ''}</span>;
    })
    return els;
  } 

  return (
    <div className='artist-block'>
      {itemsToBlock()}
    </div>
  )
}

export default ArtistBlock;