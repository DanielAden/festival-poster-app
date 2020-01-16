import React from 'react';
import './App.css';
import Home from './components/Home'
import {
  Switch,
  Route,
} from "react-router-dom";
import SpotifyAuthorize from './components/SpotifyAuthorize';

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
