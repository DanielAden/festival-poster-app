import React, { useState, Children, useEffect } from 'react';
import SpotifyInfoCapturePanel from '../SpotifyInfoCapturePanel';
import useSpotifyAccessToken from '../../store/system/useSpotifyAccessToken';
import { ModalGroup } from './Group';
import { Button } from 'reactstrap';
import { useSpotifyTopArtists } from '../../spotify/SpotifyAPIHooks';
import List, { useList, ListItems } from '../List/List';
import { SpotifyArtistObject } from '../../spotify/SpotifyAPI';
import { useDispatch } from 'react-redux';
import {
  updateArtistList,
  mergeArtistList,
} from '../../store/Poster/posterSlice';

interface Props {}
const ImportArtists: React.FC<Props> = () => {
  const data = useSpotifyAccessToken();
  const showAuth = data.status !== 'VALID';

  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [artists, setArtists] = useState<ListItems<SpotifyArtistObject>>([]);
  const dispatch = useDispatch();
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
          pageHeaders={['Select Artists']}
          active={showModal}
          toggle={toggle}
          currentPage={page}
          onNextPage={() => setPage(page + 1)}
          onPrevPage={() => setPage(page - 1)}
          submit={[
            {
              text: 'Replace Existing Artists',
              submitFN: () => {
                const selected = artists.filter(a => a.isSelected);
                dispatch(updateArtistList(selected));
              },
            },
            {
              text: 'Merge with Existing Artists',
              submitFN: () => {
                const selected = artists.filter(a => a.isSelected);
                dispatch(mergeArtistList(selected));
              },
            },
          ]}
        >
          <SpotifyArtists
            setArtistListItems={setArtists}
            timeRange={'medium_term'}
          />
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
  // setArtistListItems: (items: ListItem<SpotifyArtistObject>[]) => void;
  setArtistListItems: React.Dispatch<any>;
}
const SpotifyArtists: React.FC<SpotifyArtistsProps> = ({
  timeRange,
  setArtistListItems,
}) => {
  const artists = useSpotifyTopArtists(timeRange);
  // const items = mapToListItems(artists);
  const [items, setItems, listItemHook] = useList<SpotifyArtistObject>();

  useEffect(() => {
    if (artists.length === 0) return;
    setItems(artists);
  }, [artists, setItems]);

  useEffect(() => {
    setArtistListItems(items);
  }, [items, setArtistListItems]);

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
