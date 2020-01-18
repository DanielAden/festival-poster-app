import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ListItem } from '../../components/List/List'
import produce from "immer"

export interface PosterState {
  artists: ListItem[];
  topArtistsTimeRange: string; // TODO make this type safe
  themeType: string;
  height: number;
  width: number;
}

const initialState: PosterState = {
  artists: [],
  themeType: 'theme1',
  topArtistsTimeRange: 'medium_term',
  width: 600,
  height: 900,
}

const posterSlice = createSlice({
  name: 'poster',
  initialState,
  reducers: {
    changeThemeType(state, action: PayloadAction<string>) {
      return produce(state, draftState => {
        draftState.themeType = action.payload;
      })
    },
    updateArtistList(state, action: PayloadAction<ListItem[]>) {
      return produce(state, draftState => {
        draftState.artists = action.payload;
      })
    },
    topArtistsTimeRangeUpdated(state, action: PayloadAction<string>) {
      return produce(state, draftState => {
        draftState.topArtistsTimeRange = action.payload;
      })
    },
  }
})

export const { changeThemeType, updateArtistList, topArtistsTimeRangeUpdated } = posterSlice.actions;

export default posterSlice.reducer;