import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';

import reducer from '../reducers';

const store = createStore(reducer, applyMiddleware(reduxThunk, reduxLogger));

export default store;
