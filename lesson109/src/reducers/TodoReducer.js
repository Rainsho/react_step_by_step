import uuid from 'uuid';
import find from 'lodash/find';
import { LOGIN, LOGOUT, ADD_TODO, MARK_TODO, DELETE_TODO, REGISTER } from '../constants/ActionTypes';
import { todos, doers } from '../constants/MockData';

const initState = {
  todos,
  doers,
  doer: null,
  errMsg: null,
};

export default function TodoReducer(state = initState, action) {
  let doer;
  let name;
  let pswd;
  let tid;
  let uname;
  let content;
  const tempState = state;
  switch (action.type) {
    case LOGIN:
      name = action.payload.name;
      pswd = action.payload.pswd;
      doer = find(state.doers, { name });
      if (doer) {
        if (doer.pswd === pswd) {
          tempState.doer = doer;
        } else {
          tempState.errMsg = 'password do not match';
        }
      } else {
        tempState.errMsg = 'user not exist!';
      }
      return Object.assign({}, tempState);
    case LOGOUT:
      tempState.doer = null;
      tempState.errMsg = '';
      return Object.assign({}, tempState);
    case REGISTER:
      name = action.payload.name;
      pswd = action.payload.pswd;
      doer = find(state.doers, { name });
      if (doer) {
        tempState.errMsg = 'User have been exist, please login';
      } else {
        doer = { uid: uuid.v4(), name, pswd };
        tempState.doer = doer;
        tempState.doers.push(doer);
      }
      return Object.assign({}, tempState);
    case ADD_TODO:
      content = action.payload.content;
      uname = state.doer
        ? state.doer.name
        : state.doers[0].name;
      tempState.todos.push({ tid: uuid.v4(), done: false, uname, content });
      return Object.assign({}, tempState);
    case MARK_TODO:
      tid = action.payload.tid;
      tempState.todos = state.todos.map((x) => {
        if (x.tid !== tid) return x;
        return { ...x, done: !x.done };
      });
      return Object.assign({}, tempState);
    case DELETE_TODO:
      tid = action.payload.tid;
      tempState.todos = state.todos.filter(x => x.tid !== tid);
      return Object.assign({}, tempState);
    default:
      return state;
  }
}
