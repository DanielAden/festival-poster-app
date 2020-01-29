import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ListItems } from '../../components/List/List';
import { unionBy } from 'lodash';
import { SpotifyUserObject } from '../../spotify/SpotifyAPI';

export const DEFAULT_FESTIVAL_NAME = 'My Festival';
export const DEFAULT_PRESENTED_BY = 'Presented by Red Bull';
export const DEFAULT_HEADLINER = 'Select a Headliner';

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
  headliners: Array<string[]>;
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
  headliners: [[], [], []],
};

const posterSlice = createSlice({
  name: 'poster',
  initialState,
  reducers: {
    mergePoster(state, action: PayloadAction<Partial<PosterState>>) {
      return { ...state, ...action.payload };
    },
    changeThemeType(state, action: PayloadAction<string>) {
      state.themeType = action.payload;
    },
    changeFestivalName(state, action: PayloadAction<string>) {
      state.festivalName = action.payload;
    },
    changeLayoutType(state, action: PayloadAction<string>) {
      state.layoutType = action.payload;
    },
    artistAdded(state, action: PayloadAction<PosterState['artists'][0]>) {
      state.artists.unshift(action.payload);
    },
    updateArtistList(state, action: PayloadAction<PosterState['artists']>) {
      state.artists = action.payload;
      state.headliners = [[], [], []];
    },
    artistRemoved(state, action: PayloadAction<AppArtistObject>) {
      const { name } = action.payload;
      const removedArtist = (ao: PosterState['artists'][0]) =>
        ao.data.name !== name;
      const removedName = (headliner: string) => headliner === name;

      state.artists = state.artists.filter(removedArtist);
      state.headliners.forEach((headlinerList, line) => {
        const pos = headlinerList.findIndex(removedName);
        if (pos > -1) state.headliners[line].splice(pos, 1);
      });
    },
    mergeArtistList(state, action: PayloadAction<PosterState['artists']>) {
      const newState = {
        ...state,
        artists: unionBy(state.artists, action.payload, a => a.data.name),
      };
      return newState;
    },
    moveArtist(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (from === to) return;
      const fromArtist = state.artists[from];
      if (from < to) {
        state.artists.splice(to + 1, 0, fromArtist);
        state.artists.splice(from, 1);
      } else {
        state.artists.splice(from, 1);
        state.artists.splice(to, 0, fromArtist);
      }
    },
    updateMeData(state, action: PayloadAction<SpotifyUserObject>) {},
    topArtistsTimeRangeUpdated(state, action: PayloadAction<string>) {
      state.topArtistsTimeRange = action.payload;
    },
    headlinerChanged(
      state,
      action: PayloadAction<{
        line: number;
        pos: number;
        newHeadliner: string;
      }>,
    ) {
      const { line, pos, newHeadliner } = action.payload;
      state.headliners[line][pos] = newHeadliner;
    },
    headlinerRemoved(
      state,
      action: PayloadAction<{
        line: number;
        pos: number;
      }>,
    ) {
      const { line, pos } = action.payload;
      state.headliners[line].splice(pos, 1);
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
  headlinerChanged,
  headlinerRemoved,
  artistAdded,
} = posterSlice.actions;

export default posterSlice.reducer;
