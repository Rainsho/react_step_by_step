import { LOGIN, LOGOUT, ADD_TODO, MARK_TODO, DELETE_TODO, REGISTER } from '../constants/ActionTypes';

export function createLoginAction(name, pswd) {
  return {
    type: LOGIN,
    payload: {
      name, pswd,
    },
  };
}
export function createRegisterAction(name, pswd) {
  return {
    type: REGISTER,
    payload: {
      name, pswd,
    },
  };
}
export function createLogoutAction() {
  return {
    type: LOGOUT,
  };
}
export function createAddTodoAction(content) {
  return {
    type: ADD_TODO,
    payload: {
      content,
    },
  };
}
export function createMarkTodoAction(tid) {
  return {
    type: MARK_TODO,
    payload: {
      tid,
    },
  };
}
export function createDeleteTodoAction(tid) {
  return {
    type: DELETE_TODO,
    payload: {
      tid,
    },
  };
}

