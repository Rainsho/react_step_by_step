import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import createSagaMiddleware from 'redux-saga';

import reducer from '../reducers';
import { everySaga, latestSaga } from '../actions';

const sagaMiddleware = createSagaMiddleware();

const middlewares = applyMiddleware(
  sagaMiddleware,
  reduxThunk,
  routerMiddleware(hashHistory),
  reduxLogger
);

const store = createStore(reducer, middlewares);

sagaMiddleware.run(everySaga);
sagaMiddleware.run(latestSaga);

export default store;
