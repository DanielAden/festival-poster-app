import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'reactstrap';
import PosterCanvas from './Poster/PosterCanvas';
import Options from './Options';
import AppButton from './AppButton';
import SideNav from './Toolbar/SideNav';
import { useBoundingRectangle } from '../utils';

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
  const [navActive, setNavActive] = useState(false);
  const toggleNav = () => setNavActive(!navActive);
  const [rect, ref] = useBoundingRectangle<HTMLDivElement>();
  const canvasParentWidth = rect?.width;
  const canvasParentHeight = rect?.height;

  return (
    <div className='home h-100'>
      <Nav
        className='navbar navbar-expand-sm navbar-light bg-light py-0'
        style={{ marginBottom: '10px' }}
      >
        <AppButton className='mr-2' onClick={() => toggleNav()}>
          Artists
        </AppButton>
        <div className='navbar-brand'>Poster App</div>
        {renderDevTools()}
      </Nav>
      <SideNav active={navActive} toggle={toggleNav} />
      <Options />
      <div ref={ref} className='h-100'>
        <Container className='h-100'>
          <Row>
            <Col className='d-flex justify-content-center'>
              <PosterCanvas
                parentWidth={canvasParentWidth}
                parentHeight={canvasParentHeight}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
