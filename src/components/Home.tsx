import React from 'react'
import SpotifyInfoCapturePanel from './SpotifyInfoCapturePanel';
import TopArtistsList from './TopArtistsList'
import { Container, Row, Col } from 'reactstrap';
import Poster from './Poster/Poster';
import AppSelect, { useAppSelect } from './AppSelect/AppSelect';
import domtoimage from 'dom-to-image';

const createImage = async () => {
  const node = document.getElementById('poster');
  if (!node) throw Error('could not find poster element')
  const dataURL = await domtoimage.toPng(node);
  let img = new Image();
  img.src = dataURL;
  var w = window.open("",'_blank');
  if (!w) throw new Error('Could not get window')
  w.document.write(img.outerHTML);
  w.document.close(); 
}

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
            <button onClick={() => createImage()}>Create Image</button>
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
