import React from 'react';

function TodoView({ todo, doer, markTodo, deleteTodo }) {
  const { tid, done, content } = todo;
  const { name } = doer;
  return (
    <div className="todo-view">
      <input
        type="checkbox"
        checked={done}
        onClick={() => { markTodo(tid) }}
      />
      <span title={name}>{name}</span>
      <span title={content}>{content}</span>
      <button
        onClick={() => { deleteTodo(tid) }}
      >x</button>
    </div>
  );
}

export default TodoView;
