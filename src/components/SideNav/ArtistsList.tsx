import React, { useRef } from 'react';
import { createNewListItem } from '../List/List';
import useTypedSelector from '../../store/rootReducer';
import {
  artistRemoved,
  AppArtistObject,
  artistAdded,
  moveArtist,
} from '../../store/Poster/posterSlice';
import { useDispatch } from 'react-redux';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import './ArtistList.css';
import AppInput from '../AppInput/AppInput';
import { portraitPlaceholder } from '../../images';
import {
  useDrag,
  DndProvider,
  useDrop,
  DropTargetMonitor,
  XYCoord,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

// Taken from this thread: https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

const ARTIST_LIST_ITEM = 'ArtistListItem';

interface Props {}
const ArtistsList: React.FC<Props> = () => {
  const artists = useTypedSelector(s => s.poster.artists);
  const dispatch = useDispatch();
  const moveItem = (from: number, to: number) =>
    dispatch(moveArtist({ from, to }));

  const renderListGroup = () => {
    return (
      <ListGroup>
        {artists.map((artistObj, i) => (
          <Row
            artistObj={artistObj.data}
            key={artistObj.data.uri}
            rowIndex={i}
            moveItem={moveItem}
          />
        ))}
      </ListGroup>
    );
  };

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
          dispatch(artistAdded(listItem));
          return { isValid: true };
        }}
        placeholder={'Add Custom Artist'}
      />
      <DndProvider backend={isTouch ? TouchBackend : HTML5Backend}>
        {renderListGroup()}
      </DndProvider>
    </div>
  );
};

interface DragItem {
  type: string;
  rowIndex: number;
}

interface RowProps {
  artistObj: AppArtistObject;
  rowIndex: number;
  moveItem: (from: number, to: number) => void;
}
const Row: React.FC<RowProps> = ({ artistObj, rowIndex, moveItem }) => {
  const src = artistObj.images[artistObj.images.length - 1].url;
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: ARTIST_LIST_ITEM, rowIndex },
    collect: mon => ({
      isDragging: mon.isDragging(),
    }),
    end: (item, mon) => {
      const to = mon.getDropResult();
      if (!to) return;
      const toIndex = to.rowIndex;
      if (rowIndex === toIndex) return;
    },
  });

  const [{ isOver }, drop] = useDrop({
    accept: ARTIST_LIST_ITEM,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.rowIndex;
      const hoverIndex = rowIndex;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.rowIndex = hoverIndex;
    },

    drop: (item, mon) => {
      return { rowIndex };
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
    }),
  });

  isOver && console.log('over');

  const style = (): React.CSSProperties => {
    if (isDragging && !isTouch)
      return {
        opacity: 0,
      };
    if (isDragging && isTouch)
      return {
        boxShadow: 'box-shadow: 0px 0px 35px 0px rgba(0,0,0,0.75)',
      };
    if (isOver) {
      return { cursor: 'move' };
    }
    return {};
  };

  drag(drop(ref));
  const listRef = isTouch ? null : ref;
  const iconRef = isTouch ? ref : null;
  return (
    <div ref={listRef} style={style()}>
      <ListGroupItem className='px-0 py-0 bx-0 by-0 d-flex justify-content-between movable'>
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
        {!isTouch && (
          <Button
            color='danger'
            type='button'
            class='close'
            aria-label='Close'
            onClick={() => dispatch(artistRemoved(artistObj))}
          >
            <span aria-hidden='true'>&times;</span>
          </Button>
        )}
        {isTouch && (
          <div
            ref={iconRef}
            style={{ fontSize: '2rem', paddingRight: '.5rem' }}
          >
            ☰
          </div>
        )}
      </ListGroupItem>
    </div>
  );
};

export default ArtistsList;
