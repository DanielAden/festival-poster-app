import React from 'react'
import '../../style/Poster.css'
import city from '../../images/city.jpg' 
import fireworks from '../../images/fireworks.jpg' 
import ArtistBlock from './ArtistBlock'


const IMAGES: { [key: string]: string} = {
  fireworks,
  city
}


interface Props {
  backgoundImage?: string; 
}
const posterStyle = (image: string): React.CSSProperties => {
  const i = IMAGES[image]
  return {
    backgroundImage: `url(${i})`,
    backgroundSize: 'cover',
    position: 'relative',
  }
}

const Poster: React.FC<Props> = ({ backgoundImage = 'fireworks' }) => {
  return (
    <div id="poster" style={posterStyle(backgoundImage)}>
      <ArtistBlock />
    </div>
  )
}

export default Poster
  