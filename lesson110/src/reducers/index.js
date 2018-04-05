import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { intlReducer } from './IntlReducer';

export default combineReducers({ todoIntl: intlReducer, routing: routerReducer });
