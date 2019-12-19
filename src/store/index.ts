import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './rootReducer'


export const REDUX_LOCAL_STORAGE_KEY = '__REDUX_LOCAL_STORAGE_KEY'  
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  let res = next(action);
  let state = store.getState()
  let json = JSON.stringify(state);
  window.localStorage.setItem(REDUX_LOCAL_STORAGE_KEY, json);
  return res;
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const initialJSON = window.localStorage.getItem(REDUX_LOCAL_STORAGE_KEY);
const initialState = (initialJSON) ? JSON.parse(initialJSON) : undefined;

const store = createStore(
  rootReducer, 
  initialState,
  composeEnhancers(
    applyMiddleware(localStorageMiddleware),
  )
)
export default store;