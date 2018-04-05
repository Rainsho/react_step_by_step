import { v4 } from 'uuid';
import { doers, anony, LOGIN, LOGOUT } from '../constants';
import { formatMessage } from '../containers/TodoIntl';

function newDoer(name, pswd) {
  return { name, pswd, uid: v4() };
}

function findDoer(doerObj, name) {
  return Object.values(doerObj).find(x => x.name === name);
}

export function doerReducer(state = { doers, current: anony.uid }, action) {
  switch (action.type) {
    case LOGIN: {
      const { name, pswd } = action.payload;
      if (!name || !pswd) return state;
      let doer = findDoer(state.doers, name);

      // new doer
      if (!doer) {
        doer = newDoer(name, pswd);
        const doerObj = Object.assign({}, state.doers, { [doer.uid]: doer });
        return { doers: doerObj, current: doer.uid };
      }

      // pswd don't match
      if (doer.pswd !== pswd) return state;

      return { ...state, current: doer.uid };
    }
    case LOGOUT:
      return { ...state, current: anony.uid };
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
