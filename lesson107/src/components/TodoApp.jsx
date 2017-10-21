import React from 'react';
import DoerInfo from './DoerInfo';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import store from '../stores/TodoStore';
import { TODOS_CHANGE } from '../constants/TodoEvents';

export default class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: store.getTodos(),
      doer: null,
      errMsg: null,
    };
  }

  componentDidMount() {
    store.on(TODOS_CHANGE, () => {
      this.setState({ todos: store.getTodos() });
    });
  }

  componentWillUnmount() {
    store.removeListener(TODOS_CHANGE);
  }

  render() {
    const todos = [...this.state.todos];
    return (
      <div>
        <h1>Todo List</h1>
        <DoerInfo />
        <AddTodo />
        <hr />
        <TodoList todos={todos} />
      </div>
    );
  }
}
