import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import intlReducer from './IntlReducer';
import todos from './TodoReducer';
import { doerReducer, uiReducer } from './DoerReducer';

export default combineReducers({
  todos,
  doer: doerReducer,
  msg: uiReducer,
  todoIntl: intlReducer,
  routing: routerReducer,
});
