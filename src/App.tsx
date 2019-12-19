import React from 'react';
import './App.css';
import { useSelector } from 'react-redux'
import { SystemState } from './store/system/types';
import SpotifyAuth from './components/SpotifyAuth';
import Home from './components/Home'
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

interface RootState {
  system: SystemState, 
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute: React.FC<any> = ({ children, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/authenticate",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


const App: React.FC = () => {
  const [, token] = useSelector((state: RootState) => [state.system.spotifyUserId, state.system.spotifyAccessToken])
  const authenticated = (token !== '');
  return (
    <div className="App">
      <Switch>
        <PrivateRoute exact path="/" authenticated={authenticated}>
          <Home />
        </PrivateRoute>
        <Route exact path="/authenticate">
          <SpotifyAuth />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
