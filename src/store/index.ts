import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

// TODO this is only for development but still need to figure out a better way
// to do this
const VERSION = 6;
const key = 'version';
const versionStr = window.localStorage.getItem(key);
if (!versionStr) {
  window.localStorage.clear();
  window.localStorage.setItem(key, VERSION.toString());
} else {
  const version = parseInt(versionStr, 10);
  if (version < VERSION) {
    window.localStorage.clear();
    window.localStorage.setItem(key, VERSION.toString());
  }
}

// TODO look into other options to replicate this functionality.
// works for now but obviously not very efficient
export const REDUX_LOCAL_STORAGE_KEY = '__REDUX_LOCAL_STORAGE_KEY';
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  let res = next(action);
  let state = store.getState();
  let json = JSON.stringify(state);
  window.localStorage.setItem(REDUX_LOCAL_STORAGE_KEY, json);
  return res;
};

const initialJSON = window.localStorage.getItem(REDUX_LOCAL_STORAGE_KEY);
const preloadedState = initialJSON ? JSON.parse(initialJSON) : undefined;

const middleware = [localStorageMiddleware];

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware,
});

export default store;
