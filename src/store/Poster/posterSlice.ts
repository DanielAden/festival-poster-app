import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ListItem } from '../../components/List/List'
import produce from "immer"

export interface PosterState {
  artists: ListItem[];
  themeType: string;
}

const initialState: PosterState = {
  artists: [],
  themeType: 'theme1',
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
    }
  }
})

export const { changeThemeType, updateArtistList } = posterSlice.actions

export default posterSlice.reducer;