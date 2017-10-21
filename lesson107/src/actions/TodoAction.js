import TodoDispatcher from '../dispatcher/TodoDispatcher';
import { LOGIN, LOGOUT, ADD_TODO, MARK_TODO, DELETE_TODO } from '../constants/ActionTypes';

const TodoAction = {
  login(name, pswd) {
    TodoDispatcher.dispatch({
      type: LOGIN,
      payload: {
        name, pswd,
      },
    });
  },
  logout() {
    TodoDispatcher.dispatch({
      type: LOGOUT,
    });
  },
  addTodo(content) {
    TodoDispatcher.dispatch({
      type: ADD_TODO,
      payload: {
        content,
      },
    });
  },
  markTodo(tid) {
    TodoDispatcher.dispatch({
      type: MARK_TODO,
      payload: {
        tid,
      },
    });
  },
  deleteTodo(tid) {
    TodoDispatcher.dispatch({
      type: DELETE_TODO,
      payload: {
        tid,
      },
    });
  },
};

export default TodoAction;
