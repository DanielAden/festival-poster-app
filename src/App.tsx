import React, { useState } from 'react';
import './App.css';
import { SystemState } from './store/system/types';
import Home from './components/Home'
import {
  Switch,
  Route,
} from "react-router-dom";
import SpotifyAuthorize from './components/SpotifyAuthorize';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface RootState {
  system: SystemState, 
}



const App: React.FC = () => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

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
