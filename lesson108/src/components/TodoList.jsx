import React from 'react';
import { observer } from 'mobx-react';
import TodoView from './TodoView';

function TodoList({ store }) {
  const { todos, markTodo, deleteTodo } = store;
  if (todos.length === 0) return null;
  const views = todos.map(todo => (<TodoView
    key={todo.tid}
    todo={todo}
    markTodo={markTodo}
    deleteTodo={deleteTodo}
  />));
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

export default observer(TodoList);
