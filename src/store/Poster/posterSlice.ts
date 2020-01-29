import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListItems } from '../../components/List/List';
import produce from 'immer';
import { unionBy, remove } from 'lodash';
import { SpotifyUserObject } from '../../spotify/SpotifyAPI';

export const DEFAULT_FESTIVAL_NAME = 'My Festival';
export const DEFAULT_PRESENTED_BY = 'Presented by Red Bull';

export interface AppArtistImage {
  url: string;
}
export interface AppArtistObject {
  name: string;
  uri: string;
  images: AppArtistImage[];
}

export interface FestivalDate {
  date: string;
}

export interface PosterState {
  me: SpotifyUserObject | null;
  artists: ListItems<AppArtistObject>;
  topArtistsTimeRange: string; // TODO make this type safe
  layoutType: string;
  themeType: string;
  festivalName: string;
  showDates: boolean;
  date1: FestivalDate;
  date2: FestivalDate;
  date3: FestivalDate;
  showPresentedBy: boolean;
  presentedBy: string;
  headliners1: string[];
  headliners2: string[];
  headliners3: string[];
}

const initialState: PosterState = {
  me: null,
  artists: [],
  topArtistsTimeRange: 'medium_term',
  layoutType: 'basic',
  themeType: 'desert',
  festivalName: DEFAULT_FESTIVAL_NAME,
  showDates: true,
  date1: { date: 'FRIDAY APRIL 10' },
  date2: { date: 'SATURDAY APRIL 11' },
  date3: { date: 'SUNDAY APRIL 12' },
  showPresentedBy: true,
  presentedBy: DEFAULT_PRESENTED_BY,
  headliners1: [],
  headliners2: [],
  headliners3: [],
};

const posterSlice = createSlice({
  name: 'poster',
  initialState,
  reducers: {
    mergePoster(state, action: PayloadAction<Partial<PosterState>>) {
      return { ...state, ...action.payload };
    },
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
    artistRemoved(state, action: PayloadAction<AppArtistObject>) {
      const artists = [...state.artists];
      remove(artists, ao => ao.data.uri === action.payload.uri);
      return {
        ...state,
        artists,
      };
    },
    mergeArtistList(state, action: PayloadAction<PosterState['artists']>) {
      const stateArtists = [...state.artists];
      const newState = {
        ...state,
        artists: unionBy(stateArtists, action.payload, a => a.data.name),
      };
      return newState;
    },
    moveArtist(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (from === to) return state;
      const artists = [...state.artists];
      const fromArtist = artists[from];
      if (from < to) {
        artists.splice(to + 1, 0, fromArtist);
        artists.splice(from, 1);
      } else {
        artists.splice(from, 1);
        artists.splice(to, 0, fromArtist);
      }
      return {
        ...state,
        artists,
      };
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
  mergePoster,
  artistRemoved,
  moveArtist,
} = posterSlice.actions;

export default posterSlice.reducer;
