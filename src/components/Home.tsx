import React from 'react';
import TopArtistsList from './TopArtistsList';
import { Container, Row, Col, Nav } from 'reactstrap';
import Poster from './Poster/Poster';
import Options from './Options';

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
            <Options />
          </Col>
        </Row>
        <Row>
          <Col>
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

export default Home;
