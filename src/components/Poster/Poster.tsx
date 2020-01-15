import React from 'react'
import '../../style/Poster.css'
import city from '../../images/city.jpg' 
import fireworks from '../../images/fireworks.jpg' 


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
  }
}

const Poster: React.FC<Props> = ({ backgoundImage = 'fireworks' }) => {
  return (
    <div className="poster" style={posterStyle(backgoundImage)}>
      Poster 
    </div>
  )
}

export default Poster
  