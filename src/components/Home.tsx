import React from 'react'
import SpotifyInfoCapturePanel from './SpotifyInfoCapturePanel';
import TopArtistsList from './TopArtistsList'
import { Container, Row, Col, Nav, NavItem } from 'reactstrap';
import Poster from './Poster/Poster';
import AppSelect, { useAppSelect } from './AppSelect/AppSelect';
import domtoimage from 'dom-to-image';
import { useDispatch } from 'react-redux';
import { changeThemeType } from '../store/Poster/posterSlice';
import useAppSelector from '../store/rootReducer';

const createImage = async () => {
  const node = document.getElementById('poster');
  if (!node) throw Error('could not find poster element')
  const dataURL = await domtoimage.toJpeg(node);
  let img = new Image();
  img.src = dataURL;
  var w = window.open("",'_blank');
  if (!w) throw new Error('Could not get window')
  w.document.write(img.outerHTML);
  w.document.close(); 
}

const themeOptions = [
  {
    text: 'Theme 1',
    value: 'theme1',
  },
  {
    text: 'Theme 2',
    value: 'theme2',
  },
]

interface Props {
}
const Home: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const theme = useAppSelector((s) => s.poster.themeType)
  const [, themeSelectHook] = useAppSelect(themeOptions, theme, (value) => {
    dispatch(changeThemeType(value))
  });

  return (
    <div className='home'>
      <Nav className='navbar navbar-expand-sm navbar-light bg-light py-0'
        style={{marginBottom: '10px'}}>
        <div className='navbar-brand'>Poster App</div>
        {renderDevTools()}
      </Nav>
      <Container>
        <Row>
          <Col>
            <AppSelect {...themeSelectHook} />
            <button onClick={() => createImage()}>Create Image</button>
            <Poster themeType={theme}/>
          </Col>
          <Col>
            <TopArtistsList />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const renderDevTools = () => {
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <form className='form-inline'>
      <button className="btn btn-outline-danger" type="button"
        onClick={() => {
          window.localStorage.clear();
          window.location.reload();
      }}>Clear Cache</button>
    </form>
  )
}

export default Home;
