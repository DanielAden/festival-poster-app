import React, { useState } from 'react';
import TopArtistsList from './TopArtistsList';
import { Container, Row, Col, Nav } from 'reactstrap';
import PosterCanvas from './Poster/PosterCanvas';
import Options from './Options';
import AppButton from './AppButton';
import SideNav from './Toolbar/SideNav';

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

  return (
    <div className='home'>
      <Nav
        className='navbar navbar-expand-sm navbar-light bg-light py-0'
        style={{ marginBottom: '10px' }}
      >
        <AppButton onClick={() => toggleNav()}>Artists</AppButton>
        <div className='navbar-brand'>Poster App</div>
        {renderDevTools()}
      </Nav>
      <SideNav active={navActive} toggle={toggleNav} />
      <Container>
        <Row>
          <Col>
            <Options />
          </Col>
        </Row>
        <Row>
          <Col>
            <PosterCanvas />
          </Col>
          <Col>
            <TopArtistsList />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
