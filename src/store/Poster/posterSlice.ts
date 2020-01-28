import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListItems } from '../../components/List/List';
import produce from 'immer';
import { unionBy } from 'lodash';
import {
  SpotifyArtistObject,
  SpotifyUserObject,
} from '../../spotify/SpotifyAPI';

export const DEFAULT_FESTIVAL_NAME = 'My Festival';

export interface PosterState {
  me: SpotifyUserObject | null;
  artists: ListItems<SpotifyArtistObject>;
  topArtistsTimeRange: string; // TODO make this type safe
  layoutType: string;
  themeType: string;
  height: number;
  width: number;
  festivalName: string;
}

const height = window.innerHeight * 0.8;
const width = height * 0.65;

const initialState: PosterState = {
  me: null,
  artists: [],
  topArtistsTimeRange: 'medium_term',
  layoutType: 'basic',
  themeType: 'desert',
  width,
  height,
  festivalName: DEFAULT_FESTIVAL_NAME,
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
    changeFestivalName(state, action: PayloadAction<string>) {
      return produce(state, draftState => {
        draftState.festivalName = action.payload;
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
    mergeArtistList(state, action: PayloadAction<PosterState['artists']>) {
      const stateArtists = [...state.artists];
      const newState = {
        ...state,
        artists: unionBy(stateArtists, action.payload, a => a.data.name),
      };
      return newState;
    },
    updateMeData(state, action: PayloadAction<SpotifyUserObject>) {},
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
  updateMeData,
  mergeArtistList,
  changeFestivalName,
} = posterSlice.actions;

export default posterSlice.reducer;
