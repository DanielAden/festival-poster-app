import { createSlice } from '@reduxjs/toolkit'
import { ListItem } from "../../components/List/List";


export interface ArtistListState {
  artists: ListItem[];
  seperator: string; 
  gap: number;
  case: string; 
  color1: string;
  color2: string;
  color3: string;
}

const initialState: ArtistListState = {
  artists: [],
  seperator: 'none',
  gap: 0,
  case: 'uppercase',
  color1: '',
  color2: '',
  color3: '',
}

const artistBlockSlice = createSlice({
  name: 'artistBlock',
  initialState,
  reducers: {
  }
})

// export const { } = artistBlockSlice.actions
export default artistBlockSlice.reducer;
