import uuid from 'uuid';
import find from 'lodash/find';
import EventEmitter from 'events';
import { todos, doers } from '../constants/MockData';
import TodoDispatcher from '../dispatcher/TodoDispatcher';
import { DOER_CHANGE, TODOS_CHANGE } from '../constants/TodoEvents';
import { LOGIN, LOGOUT, ADD_TODO, MARK_TODO, DELETE_TODO } from '../constants/ActionTypes';

const store = {
  todos,
  doers,
  doer: null,
  errMsg: null,
};

class TodoStoreClass extends EventEmitter {
  getTodos() {
    return store.todos;
  }

  getDoer() {
    return store.doer;
  }

  getErrMsg() {
    return store.errMsg;
  }
}

const TodoStore = new TodoStoreClass();

TodoDispatcher.register((action) => {
  switch (action.type) {
    case LOGIN: {
      const { name, pswd } = action.payload;
      if (!name || !pswd) {
        store.errMsg = 'where is your password';
        TodoStore.emit(DOER_CHANGE);
        return;
      }
      let doer = find(store.doers, { name });
      if (!doer) {
        doer = { uid: uuid.v4(), name, pswd };
        store.doers.push(doer);
        store.doer = doer;
        TodoStore.emit(DOER_CHANGE);
        return;
      }
      if (doer.pswd === pswd) {
        store.doer = doer;
      } else {
        store.errMsg = 'password do not match';
      }
      TodoStore.emit(DOER_CHANGE);
      break;
    }
    case LOGOUT:
      store.doer = null;
      store.errMsg = '';
      TodoStore.emit(DOER_CHANGE);
      break;
    case ADD_TODO: {
      const { content } = action.payload;
      const uname = store.doer
        ? store.doer.name
        : store.doers[0].name;
      store.todos.push({ tid: uuid.v4(), done: false, uname, content });
      TodoStore.emit(TODOS_CHANGE);
      break;
    }
    case MARK_TODO: {
      const { tid } = action.payload;
      store.todos = store.todos.map((x) => {
        if (x.tid !== tid) return x;
        return { ...x, done: !x.done };
      });
      TodoStore.emit(TODOS_CHANGE);
      break;
    }
    case DELETE_TODO: {
      const { tid } = action.payload;
      store.todos = store.todos.filter(x => x.tid !== tid);
      TodoStore.emit(TODOS_CHANGE);
      break;
    }
    default:
  }
});

export default TodoStore;
