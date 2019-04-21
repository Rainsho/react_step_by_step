import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import 'rxjs-compat';

import App from './app';
import reducers from './reducers';
import epics from './epics';

const store = createStore(reducers, applyMiddleware(createEpicMiddleware(epics)));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
