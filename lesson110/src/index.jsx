import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';
import routes from './routes';

const history = syncHistoryWithStore(hashHistory, store);

const App = () => (
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
