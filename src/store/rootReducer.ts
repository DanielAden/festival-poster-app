import { combineReducers } from 'redux';
import { artistListReducer } from './ArtistBlock/reducers'
import { systemReducer } from './system/reducers'

export const rootReducer = combineReducers({
  artistList: artistListReducer,
  system: systemReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
