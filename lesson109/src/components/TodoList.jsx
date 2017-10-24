import React from 'react';
import TodoView from './TodoView';

function TodoList({ todos }) {
  if (todos.length === 0) return null;
  const views = todos.map(todo => <TodoView key={todo.tid} todo={todo} />);
  return (
    <div>
      <div className="todo-title">
        <span>done</span>
        <span>user</span>
        <span>content</span>
        <span>delete</span>
      </div>
      {views}
    </div>
  );
}

export default TodoList;
