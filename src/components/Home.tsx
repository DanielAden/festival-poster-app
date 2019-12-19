import ArtistSelectorPanel from './ArtistSelectorPanel/ArtistSelectorPanel'
import React from 'react'

interface Props {
  
}

const Home: React.FC<Props> = () => {
  return (
    <div>
      <ArtistSelectorPanel />      
    </div>
  )
}

export default Home;
