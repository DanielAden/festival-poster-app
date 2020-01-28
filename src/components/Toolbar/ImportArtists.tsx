import React, { useEffect, useState } from 'react';
import SpotifyInfoCapturePanel from '../SpotifyInfoCapturePanel';
import useSpotifyAccessToken from '../../store/system/useSpotifyAccessToken';
import { ModalGroup, useModalGroup, GroupStatePkg } from './Group';
import { Button } from 'reactstrap';
import { useSpotifyTopArtists } from '../../spotify/SpotifyAPIHooks';
import List, { useList, ListItem } from '../List/List';
import { SpotifyArtistObject } from '../../spotify/SpotifyAPI';
import { useDispatch } from 'react-redux';
import {
  updateArtistList,
  mergeArtistList,
} from '../../store/Poster/posterSlice';

interface TopArtistsGS {
  artists: ListItem<SpotifyArtistObject>[];
}

interface Props {}
const ImportArtists: React.FC<Props> = () => {
  const data = useSpotifyAccessToken();
  const showAuth = data.status !== 'VALID';
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState('');

  const [topArtistsGS, topArtistProps, topArtistToggle] = useModalGroup<
    TopArtistsGS
  >(
    ['Select Artists'],
    [
      {
        text: 'Replace Existing Artists',
        submitFN: state => {
          const selected = state.artists.filter(a => a.isSelected);
          dispatch(updateArtistList(selected));
        },
      },
      {
        text: 'Merge with Existing Artists',
        submitFN: state => {
          const selected = state.artists.filter(a => a.isSelected);
          dispatch(mergeArtistList(selected));
        },
      },
    ],
    { artists: [] },
  );

  const renderPlaylistModal = () => {
    return (
      <ModalGroup {...topArtistProps}>
        <SpotifyArtists {...topArtistsGS} timeRange={'medium_term'} />
      </ModalGroup>
    );
  };

  const renderTopArtistModal = () => {
    return (
      <ModalGroup {...topArtistProps}>
        <SpotifyArtists {...topArtistsGS} timeRange={timeRange} />
      </ModalGroup>
    );
  };

  const renderButtons = () => {
    return (
      <div className='d-flex flex-column'>
        <Button
          className={'btn-success mx-1 my-1'}
          onClick={() => {
            topArtistToggle();
            setTimeRange('long_term');
          }}
        >
          Import Your Top Artists (All Time)
        </Button>
        <Button
          className={'btn-success mx-1 my-1'}
          onClick={() => {
            topArtistToggle();
            setTimeRange('medium_term');
          }}
        >
          Import Your Top Artists (6 Months)
        </Button>
        <Button
          className={'btn-success mx-1 my-1'}
          onClick={() => {
            topArtistToggle();
            setTimeRange('short_term');
          }}
        >
          Import Your Top Artists (1 Month)
        </Button>
        <Button className={'btn-success mx-1 my-1'}>
          Import From a Playlist
        </Button>
        {renderTopArtistModal()}
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
          height: '50px', // TODO don't hardcode these values
          width: '50px',
          marginRight: '5px',
        }}
      />
      {data.name}
    </span>
  );
};

interface SpotifyArtistsProps extends GroupStatePkg<TopArtistsGS> {
  timeRange: string;
}
const SpotifyArtists: React.FC<SpotifyArtistsProps> = ({
  timeRange,
  children,
  ...groupStatePkg
}) => {
  const artists = useSpotifyTopArtists(timeRange);
  const [items, setItems, listItemHook] = useList<SpotifyArtistObject>();

  useEffect(() => {
    if (artists.length === 0) return;
    setItems(artists);
  }, [artists, setItems]);

  useEffect(() => {
    groupStatePkg.mergeState({ artists: items });
  }, [groupStatePkg, items]);

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
