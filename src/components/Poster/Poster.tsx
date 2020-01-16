import React, { useRef, useState, useEffect } from 'react'
import '../../style/Poster.css'
import city from '../../images/city.jpg' 
import fireworks from '../../images/fireworks.jpg' 
import ArtistBlock from './ArtistBlock'
import FestivalName from './FestivalName';


const IMAGES: { [key: string]: string} = {
  fireworks,
  city
}


interface Props {
  backgoundImage?: string; 
}

const Poster: React.FC<Props> = ({ backgoundImage = 'fireworks' }) => {
  const [storedRect, setStoredRect] = useState<DOMRect | null>(null)
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setStoredRect(rect);
  }, [ref])

  const style = (): React.CSSProperties => {
    const i = IMAGES[backgoundImage]
    return {
      backgroundImage: `url(${i})`,
      backgroundSize: 'cover',
      position: 'relative',
      width: '600px',
      height: '800px',
      boxSizing: 'border-box',
    }
  }

  console.log('parent: ' + storedRect)
  return (
    <div ref={ref} id="poster" style={style()}>
      <FestivalName posterRect={storedRect}/>
      <ArtistBlock posterRect={storedRect}/>
    </div>
  )
}

export default Poster
  