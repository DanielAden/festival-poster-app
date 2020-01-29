import React from 'react';
import { Container, Row, Col, Nav } from 'reactstrap';
import PosterCanvas from './Poster/PosterCanvas';
import Options from './Options';
import AppButton from './AppButton';
import SideNav from './SideNav/SideNav';
import { useBoundingRectangle } from '../utils';
import { useDispatch } from 'react-redux';
import { toggleSideNav } from '../store/SideNav/sideNavSlice';

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

interface Props {}
const Home: React.FC<Props> = () => {
  const [rect, ref] = useBoundingRectangle<HTMLDivElement>();
  const dispatch = useDispatch();

  return (
    <div className='home h-100'>
      <Nav
        className='navbar navbar-expand-sm navbar-light bg-light py-0'
        style={{ marginBottom: '10px' }}
      >
        <AppButton className='mr-2' onClick={() => dispatch(toggleSideNav())}>
          Options
        </AppButton>
        <div className='navbar-brand'>Poster App</div>
        {renderDevTools()}
      </Nav>
      <SideNav />
      <Options />
      <div ref={ref} className='h-100'>
        <Container className='h-100'>
          <Row className='h-100'>
            <Col className='d-flex justify-content-center h-100'>
              <PosterCanvas parentDomRect={rect} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
