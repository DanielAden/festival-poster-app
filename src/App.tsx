import React from 'react';
import './App.css';
import { SystemState } from './store/system/types';
import Home from './components/Home'
import {
  Switch,
  Route,
} from "react-router-dom";
import SpotifyAuthorize from './components/SpotifyAuthorize';

interface RootState {
  system: SystemState, 
}

const App: React.FC = () => {
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
