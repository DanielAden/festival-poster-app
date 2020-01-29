import React from 'react';
import List, { useReduxList } from '../List/List';
import useTypedSelector, { RootState } from '../../store/rootReducer';
import { artistRemoved } from '../../store/Poster/posterSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import { SpotifyArtistObject } from '../../spotify/SpotifyAPI';
import './ArtistList.css';

interface Props {}
const ArtistsList: React.FC<Props> = () => {
  const artists = useTypedSelector(s => s.poster.artists);

  return (
    <div>
      <ListGroup>
        {artists.map(artistObj => (
          <Row artistObj={artistObj.data} key={artistObj.data.uri} />
        ))}
      </ListGroup>
    </div>
  );
};

interface RowProps {
  artistObj: SpotifyArtistObject;
}
const Row: React.FC<RowProps> = ({ artistObj }) => {
  const src = artistObj.images[artistObj.images.length - 1].url;
  const dispatch = useDispatch();
  return (
    <ListGroupItem className='px-0 py-0 bx-0 by-0 d-flex justify-content-between'>
      <span>
        <img
          className=''
          alt={artistObj.name + ' photo'}
          src={src}
          style={{
            height: '3rem',
            width: '3rem',
            marginRight: '5px',
          }}
        />
        {artistObj.name}
      </span>
      <Button
        color='danger'
        type='button'
        class='close'
        aria-label='Close'
        onClick={() => dispatch(artistRemoved(artistObj))}
      >
        <span aria-hidden='true'>&times;</span>
      </Button>
    </ListGroupItem>
  );
};

export default ArtistsList;
