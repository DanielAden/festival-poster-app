import React from 'react';
import SpotifyInfoCapturePanel from '../SpotifyInfoCapturePanel';
import useSpotifyAccessToken from '../../store/system/useSpotifyAccessToken';
import { Button } from 'reactstrap';

interface Props {}
const ImportArtists: React.FC<Props> = () => {
  const data = useSpotifyAccessToken();
  const showAuth = data.status !== 'VALID';

  const renderButtons = () => {
    return (
      <div className='d-flex flex-column'>
        <Button className={'btn-success mx-1 my-1'}>
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

export default ImportArtists;
