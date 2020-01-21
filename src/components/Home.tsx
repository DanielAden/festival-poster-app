import React, { useCallback } from 'react';
import TopArtistsList from './TopArtistsList';
import { Container, Row, Col, Nav } from 'reactstrap';
import Poster, { POSTER_CANVAS_ID } from './Poster/Poster';
import AppSelect, { useAppSelect } from './AppSelect/AppSelect';
import { useDispatch } from 'react-redux';
import { changeThemeType } from '../store/Poster/posterSlice';
import useAppSelector from '../store/rootReducer';
import AppButton from './AppButton';
import { usePosterTheme } from './Poster/PosterThemes';

const useCreateImage = () => {
  const theme = usePosterTheme();
  const createImage = useCallback(() => {
    const can = document.getElementById(POSTER_CANVAS_ID) as HTMLCanvasElement;
    if (!can) throw new Error('Expected canvas node');
    theme.postDrawCB = () => {
      const dataURL = can.toDataURL('image/jpeg', 1.0);
      const w = window.open('_blank');
      w?.document.write(`<img src="${dataURL}"></img>`);
    };
    theme.draw(can, true);
  }, [theme]);
  return createImage;
};

const themeOptions = [
  {
    text: 'Theme 1',
    value: 'theme1',
  },
  {
    text: 'Theme 2',
    value: 'theme2',
  },
];

interface Props {}
const Home: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const themeType = useAppSelector(s => s.poster.themeType);
  const [, themeSelectHook] = useAppSelect(themeOptions, themeType, value => {
    dispatch(changeThemeType(value));
  });
  const createImage = useCreateImage();

  return (
    <div className='home'>
      <Nav
        className='navbar navbar-expand-sm navbar-light bg-light py-0'
        style={{ marginBottom: '10px' }}
      >
        <div className='navbar-brand'>Poster App</div>
        {renderDevTools()}
      </Nav>
      <Container>
        <Row>
          <Col>
            <AppSelect {...themeSelectHook} />
            <AppButton color={'warning'} onClick={() => createImage()}>
              Create Image
            </AppButton>
            <Poster />
          </Col>
          <Col>
            <TopArtistsList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const renderDevTools = () => {
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <form className='form-inline'>
      <button
        className='btn btn-outline-danger'
        type='button'
        onClick={() => {
          window.localStorage.clear();
          window.location.reload();
        }}
      >
        Clear Cache
      </button>
    </form>
  );
};

export default Home;
