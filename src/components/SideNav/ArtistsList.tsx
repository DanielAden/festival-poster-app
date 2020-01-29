import React from 'react';
import List, { useReduxList, createNewListItem } from '../List/List';
import useTypedSelector, { RootState } from '../../store/rootReducer';
import {
  artistRemoved,
  AppArtistObject,
  updateArtistList,
  moveArtist,
} from '../../store/Poster/posterSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, ListGroupItem, Button, Input } from 'reactstrap';
import { SpotifyArtistObject } from '../../spotify/SpotifyAPI';
import './ArtistList.css';
import AppInput from '../AppInput/AppInput';
import { portraitPlaceholder } from '../../images';
import { useDrag, DndProvider, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const ARTIST_LIST_ITEM = 'ArtistListItem';

interface Props {}
const ArtistsList: React.FC<Props> = () => {
  const artists = useTypedSelector(s => s.poster.artists);
  const dispatch = useDispatch();

  return (
    <div>
      <AppInput
        submittable
        submitText={'Add'}
        submitHook={text => {
          const newArtist: AppArtistObject = {
            name: text,
            uri: text,
            images: [{ url: portraitPlaceholder }],
          };
          const listItem = createNewListItem({
            data: newArtist,
            isSelected: true,
            userAdded: true,
            canEdit: true,
          });
          dispatch(updateArtistList([listItem, ...artists]));
          return { isValid: true };
        }}
        placeholder={'Add Custom Artist'}
      />
      <DndProvider backend={HTML5Backend}>
        <ListGroup>
          {artists.map((artistObj, i) => (
            <Row
              artistObj={artistObj.data}
              key={artistObj.data.uri}
              rowIndex={i}
            />
          ))}
        </ListGroup>
      </DndProvider>
    </div>
  );
};

interface RowProps {
  artistObj: AppArtistObject;
  rowIndex: number;
}
const Row: React.FC<RowProps> = ({ artistObj, rowIndex }) => {
  const src = artistObj.images[artistObj.images.length - 1].url;
  const dispatch = useDispatch();
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: ARTIST_LIST_ITEM },
    collect: mon => ({
      isDragging: mon.isDragging(),
    }),
    end: (item, mon) => {
      const to = mon.getDropResult();
      if (!to) return;
      const toIndex = to.rowIndex + 1;
      if (rowIndex === toIndex) return;
      dispatch(moveArtist({ from: rowIndex, to: toIndex }));
    },
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: ARTIST_LIST_ITEM,
    drop: (item, mon) => {
      return { rowIndex };
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
    }),
  });

  isOver && console.log('over');

  const style = (): React.CSSProperties => {
    if (isDragging)
      return {
        opacity: 0.5,
      };
    return {};
  };

  return (
    <div ref={dragRef} style={style()}>
      <div ref={dropRef}>
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
      </div>
      {isOver && (
        <li
          style={{
            height: '100%',
            backgroundColor: 'lightgreen',
            opacity: 0.5,
          }}
        ></li>
      )}
    </div>
  );
};

export default ArtistsList;
