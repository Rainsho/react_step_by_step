import React from 'react';
import TodoView from './TodoView';

function TodoList({ todos, doers, markTodo, deleteTodo }) {
  if (todos.length === 0) return null;
  const views = todos.map(todo => {
    const doer = doers[todo.uid] || doers[0];
    return (<TodoView
      key={todo.tid}
      todo={todo}
      doer={doer}
      markTodo={markTodo}
      deleteTodo={deleteTodo}
    />);
  });
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
