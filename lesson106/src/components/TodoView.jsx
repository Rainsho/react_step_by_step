import React from 'react';

function TodoView({ todo, doer, markTodo, deleteTodo }) {
  const { tid, done, content } = todo;
  const { name } = doer;
  return (
    <div className="todo-view">
      <span><input
        type="checkbox"
        checked={done}
        onClick={() => { markTodo(tid); }}
      /></span>
      <span title={name}>{name}</span>
      <span title={content}>{content}</span>
      <span><button
        onClick={() => { deleteTodo(tid); }}
      >x</button></span>
    </div>
  );
}

export default TodoView;
