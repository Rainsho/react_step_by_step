import React from 'react';

function TodoView({ todo, deleteTodo, mark }) {
  const { tid, uname, done, content } = todo;

  function handleDelete() {
    deleteTodo(tid);
  }

  function handleMark() {
    mark(tid);
  }

  return (
    <div className="todo-view">
      <span><input
        type="checkbox"
        checked={done}
        onClick={handleMark}
      /></span>
      <span title={uname}>{uname}</span>
      <span title={content}>{content}</span>
      <span><button onClick={handleDelete}>x</button></span>
    </div>
  );
}

export default TodoView;
