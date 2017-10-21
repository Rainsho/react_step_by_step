import React from 'react';
import action from '../actions/TodoAction';

function TodoView({ todo }) {
  const { tid, uname, done, content } = todo;
  return (
    <div className="todo-view">
      <span><input
        type="checkbox"
        checked={done}
        onClick={() => { action.markTodo(tid); }}
      /></span>
      <span title={uname}>{uname}</span>
      <span title={content}>{content}</span>
      <span><button
        onClick={() => { action.deleteTodo(tid); }}
      >x</button></span>
    </div>
  );
}

export default TodoView;
