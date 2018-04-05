import { combineReducers } from 'redux';
import { v4 } from 'uuid';
import { LOGIN, LOGOUT } from '../constants';
import { doers } from '../constants';
import { formatMessage } from '../containers/TodoIntl';

const doersDB = { ...doers };
const anony = doersDB[0];

function newDoer(name, pswd) {
  return { name, pswd, uid: v4() };
}

function findDoer(name) {
  return Object.values(doersDB).find(x => x.name === name);
}

export function doerReducer(state = anony, action) {
  switch (action.type) {
    case LOGIN: {
      const { name, pswd } = action.payload;
      if (!name || !pswd) return state;
      let doer = findDoer(name);

      // new doer
      if (!doer) {
        doer = newDoer(name, pswd);
        doersDB[doer.uid] = doer;
        return doer;
      }

      // pswd don't match
      if (doer.pswd !== pswd) return state;

      return doer;
    }
    case LOGOUT:
      return anony;
    default:
      return state;
  }
}

export function uiReducer(state = null, action) {
  switch (action.type) {
    case LOGIN: {
      const { name, pswd } = action.payload;
      if (!name || !pswd) return formatMessage('COMMON.HELLO');
      const doer = findDoer(name);
      if (!doer || doer.pswd === pswd) return null;
      return formatMessage('COMMON.HELLO');
    }
    case LOGOUT:
      return null;
    default:
      return state;
  }
}
