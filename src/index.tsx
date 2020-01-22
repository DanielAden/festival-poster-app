import './index.css';
import './fonts/fonts.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store';
import GlobalError from './components/GlobalError';
import { MemoryRouter as Router } from 'react-router-dom';

// TODO this is only for development but still need to figure out a better way
// to do this
const VERSION = 2;
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

ReactDOM.render(
  <Provider store={store}>
    <GlobalError>
      <Router>
        <App />
      </Router>
    </GlobalError>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
