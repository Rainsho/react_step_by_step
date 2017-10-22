import React from 'react';
import DoerInfo from './DoerInfo';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import store from '../stores/TodoStore';

export default function () {
  return (
    <div>
      <h1>Todo List</h1>
      <DoerInfo store={store} />
      <AddTodo store={store} />
      <hr />
      <TodoList store={store} />
    </div>
  );
}
