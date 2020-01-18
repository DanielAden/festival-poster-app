import React from 'react'
import TopArtistsList from './TopArtistsList'
import { Container, Row, Col, Nav, } from 'reactstrap';
import Poster from './Poster/Poster';
import AppSelect, { useAppSelect } from './AppSelect/AppSelect';
import { useDispatch } from 'react-redux';
import { changeThemeType } from '../store/Poster/posterSlice';
import useAppSelector from '../store/rootReducer';
import AppButton from './AppButton';

const createImage = async () => {
  const can = document.getElementById('poster') as HTMLCanvasElement;
  if (!can) throw new Error('Expected canvas node')
  const dataURL = can.toDataURL('image/jpeg', 1.0);
  const w = window.open('_blank') 
  w?.document.write(`<img src="${dataURL}"></img>`)
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
            <AppButton color={'warning'} onClick={() => createImage()}>Create Image</AppButton>
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
