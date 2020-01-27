import React, { useState, Children, useEffect } from 'react';
import SpotifyInfoCapturePanel from '../SpotifyInfoCapturePanel';
import useSpotifyAccessToken from '../../store/system/useSpotifyAccessToken';
import { ModalGroup } from './Group';
import { Button } from 'reactstrap';
import { useSpotifyTopArtists } from '../../spotify/SpotifyAPIHooks';
import List, { useList } from '../List/List';

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
          <SpotifyArtists timeRange={'medium_term'} />
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

const renderSpotifyArtist = (data: any) => {
  const url = data.images[data.images.length - 1].url;
  return (
    <span>
      <img
        className=''
        alt={data.name + ' photo'}
        src={url}
        style={{
          height: '50px',
          width: '50px',
          marginRight: '5px',
        }}
      />
      {data.name}
    </span>
  );
};

interface SpotifyArtistsProps {
  timeRange: string;
}
const SpotifyArtists: React.FC<SpotifyArtistsProps> = ({ timeRange }) => {
  const artists = useSpotifyTopArtists(timeRange);
  // const items = mapToListItems(artists);
  const [items, setItems, listItemHook] = useList();

  useEffect(() => {
    if (artists.length === 0) return;
    setItems(artists);
  }, [artists, setItems]);

  return (
    <div>
      <List
        canSelect
        items={items}
        {...listItemHook}
        renderData={renderSpotifyArtist}
      />
    </div>
  );
};

export default ImportArtists;
