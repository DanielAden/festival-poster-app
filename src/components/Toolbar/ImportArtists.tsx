import React, { useState, Children } from 'react';
import SpotifyInfoCapturePanel from '../SpotifyInfoCapturePanel';
import useSpotifyAccessToken from '../../store/system/useSpotifyAccessToken';
import { ModalGroup } from './Group';
import { Button } from 'reactstrap';

interface Props {}
const ImportArtists: React.FC<Props> = () => {
  const data = useSpotifyAccessToken();
  const showAuth = data.status !== 'VALID';

  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const toggle = () => setShowModal(!showModal);

  const renderButtons = () => {
    return (
      <div className='d-flex flex-column'>
        <Button
          className={'btn-success mx-1 my-1'}
          onClick={() => setShowModal(true)}
        >
          Import Your Top Artists (All Time)
        </Button>
        <Button className={'btn-success mx-1 my-1'}>
          Import Your Top Artists (6 Months)
        </Button>
        <Button className={'btn-success mx-1 my-1'}>
          Import Your Top Artists (1 Month)
        </Button>
        <Button className={'btn-success mx-1 my-1'}>
          Import From a Playlist
        </Button>
        <ModalGroup
          active={showModal}
          toggle={toggle}
          currentPage={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          onSubmit={() => {}}
        >
          <SpotifyArtists />
          <div>Page 2</div>
          <div>Page 3</div>
        </ModalGroup>
      </div>
    );
  };

  return (
    <div>
      {showAuth && <SpotifyInfoCapturePanel />}
      {!showAuth && renderButtons()}
    </div>
  );
};

interface SpotifyArtistsProps {}
const SpotifyArtists: React.FC<SpotifyArtistsProps> = () => {
  return <div>Spotify Artists</div>;
};

export default ImportArtists;
