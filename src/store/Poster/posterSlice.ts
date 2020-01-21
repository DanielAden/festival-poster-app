import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListItems } from '../../components/List/List';
import produce from 'immer';
import { SpotifyArtistObject } from '../../spotify/SpotifyAPI';

export interface PosterState {
  artists: ListItems<SpotifyArtistObject>;
  topArtistsTimeRange: string; // TODO make this type safe
  layoutType: string;
  themeType: string;
  height: number;
  width: number;
}

const height = window.innerHeight * 0.8;
const width = height * 0.65;

const initialState: PosterState = {
  artists: [],
  topArtistsTimeRange: 'medium_term',
  layoutType: 'basic',
  themeType: 'theme1',
  width,
  height,
};

const posterSlice = createSlice({
  name: 'poster',
  initialState,
  reducers: {
    changeThemeType(state, action: PayloadAction<string>) {
      return produce(state, draftState => {
        draftState.themeType = action.payload;
      });
    },
    changeLayoutType(state, action: PayloadAction<string>) {
      return produce(state, draftState => {
        draftState.layoutType = action.payload;
      });
    },
    updateArtistList(state, action: PayloadAction<PosterState['artists']>) {
      return produce(state, draftState => {
        draftState.artists = action.payload;
      });
    },
    topArtistsTimeRangeUpdated(state, action: PayloadAction<string>) {
      return produce(state, draftState => {
        draftState.topArtistsTimeRange = action.payload;
      });
    },
  },
});

export const {
  changeThemeType,
  updateArtistList,
  topArtistsTimeRangeUpdated,
  changeLayoutType,
} = posterSlice.actions;

export default posterSlice.reducer;
