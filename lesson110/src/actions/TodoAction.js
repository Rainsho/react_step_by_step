import { ADD_TODO, MARK_TODO, DELETE_TODO } from '../constants';

export function addTodo(uid, content) {
  return { type: ADD_TODO, payload: { uid, content } };
}

export function markTodo(tid) {
  return { type: MARK_TODO, payload: tid };
}

export function deleteTodo(tid) {
  return { type: DELETE_TODO, payload: tid };
}
