import React from 'react'
import SpotifyInfoCapturePanel from './SpotifyInfoCapturePanel';
import TopArtistsList from './TopArtistsList'
import { Container, Row, Col } from 'reactstrap';
import Poster from './Poster/Poster';
import AppSelect, { useAppSelect } from './AppSelect/AppSelect';

const imageOptions = [
  {
    text: 'Picture 1',
    value: 'fireworks',
  },
  {
    text: 'Picture 2',
    value: 'city',
  },
]

interface Props {
  
}

const Home: React.FC<Props> = () => {
  const [selectedImage, imageSelectHook] = useAppSelect(imageOptions, imageOptions[0].value);
  return (
    <div className="home">
      <SpotifyInfoCapturePanel />
      <Container>
        <Row>
          <Col>
            <AppSelect {...imageSelectHook} />
            <Poster backgoundImage={selectedImage}/>
          </Col>
          <Col>
            <TopArtistsList />
          </Col>
        </Row>
        <Row>
          Footer
        </Row>
      </Container>
    </div>
  )
}

export default Home;
