import omit from 'lodash/omit';
import { v4 } from 'uuid';
import { todos, ADD_TODO, MARK_TODO, DELETE_TODO } from '../constants';

function newTodo(uid, content) {
  return { uid, content, done: false, tid: v4() };
}

function markTodo(todo) {
  return {
    ...todo,
    done: !todo.done,
  };
}

export default function todoReducer(state = todos, action) {
  switch (action.type) {
    case ADD_TODO: {
      const { uid, content } = action.payload;
      const todo = newTodo(uid, content);
      return {
        ...state,
        [todo.tid]: todo,
      };
    }
    case MARK_TODO: {
      const tid = action.payload;
      const todo = markTodo(state[tid]);
      return {
        ...state,
        [tid]: todo,
      };
    }
    case DELETE_TODO: {
      const tid = action.payload;
      return omit(state, tid);
    }
    default:
      return state;
  }
}
