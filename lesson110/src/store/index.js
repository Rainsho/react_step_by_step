import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import reducer from '../reducers';

const store = createStore(
  reducer,
  applyMiddleware(reduxThunk, routerMiddleware(hashHistory), reduxLogger)
);

export default store;
