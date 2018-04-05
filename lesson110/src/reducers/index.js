import { combineReducers } from 'redux';

import { intlReducer } from './IntlReducer';

export default combineReducers({ todoIntl: intlReducer });
