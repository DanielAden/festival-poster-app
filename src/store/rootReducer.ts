import { combineReducers } from 'redux';
import systemSliceReducer from './system/systemSlice';
import posterSliceReducer from './Poster/posterSlice';
import { useSelector } from 'react-redux';

export const rootReducer = combineReducers({
  poster: posterSliceReducer,
  system: systemSliceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const useTypedSelector = <T>(selector: (state: RootState) => T): T => {
  const value = useSelector(selector);
  return value;
};

export default useTypedSelector;
