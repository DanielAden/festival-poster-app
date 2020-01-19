import React from 'react';
import './App.css';
import Home from './components/Home'
import {
  Switch,
  Route,
} from "react-router-dom";
import SpotifyAuthorize from './components/SpotifyAuthorize';
import { useDispatch } from 'react-redux';
import { spotifyAuthFromWindow } from './spotify/SpotifyAuth';
import { accessTokenUpdated } from './store/system/systemSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const authData = spotifyAuthFromWindow();

  // TODO update this to be safer
  if (authData.status !== 'AUTHORIZED') {
    // console.log(`Non Authorized status: ${authData.status}`)
    // console.log(authData.error)
  } else {
    if (!authData.data) throw new Error('Received authorized status without data')
    const { access_token, expires_in }  = authData.data;
    window.location.hash = '';
    dispatch(accessTokenUpdated({ spotifyAccessToken: access_token, spotifyAccessTokenExpire: expires_in}))
  }


  return (
    <div className="App">
      <Switch>
        <Route exact path="/authenticate">
          <SpotifyAuthorize />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
