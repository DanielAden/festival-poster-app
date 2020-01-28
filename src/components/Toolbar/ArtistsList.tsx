import React from 'react';
import List, { useReduxList } from '../List/List';
import { RootState } from '../../store/rootReducer';
import { updateArtistList } from '../../store/Poster/posterSlice';

interface Props {}
const ArtistsList: React.FC<Props> = () => {
  const { items, listProps } = useReduxList(
    (state: RootState) => state.poster.artists,
    updateArtistList,
    data => {
      const url = data.images[data.images.length - 1].url;
      return (
        <span>
          <img
            className=''
            alt={data.name + ' photo'}
            src={url}
            style={{
              height: '2.5rem',
              width: '2.5rem',
              marginRight: '5px',
            }}
          />
          {data.name}
        </span>
      );
    },
  );

  return (
    <div>
      {/* <h3 style={{ display: 'inline-block' }}></h3> */}
      <List items={items} {...listProps} canSelect />
    </div>
  );
};

export default ArtistsList;
