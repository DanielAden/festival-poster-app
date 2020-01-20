import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

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
