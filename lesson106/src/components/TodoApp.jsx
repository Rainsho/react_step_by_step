import React from 'react';
import { doers, todos } from '../../api/data';
import DoerInfo from './DoerInfo';
import AddTodo from './AddTodo';
import TodoList from './TodoList';

const DOERS = {};

export default class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      doer: null,
      errMsg: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.markTodo = this.markTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    for (let x of doers) {
      DOERS[x.uid] = x;
    }
  }

  componentDidMount() {
    this.setState({ todos: [...todos] });
  }

  login(name, pswd) {

  }

  logout() {

  }

  addTodo(content) {

  }

  markTodo(tid) {

  }

  deleteTodo(tid) {

  }

  render() {
    const todos = [...this.state.todos];
    const { doer, errMsg } = this.state;
    return (
      <div>
        <h1>Todo List</h1>
        <DoerInfo
          errMsg={errMsg}
          login={this.login}
          logout={this.logout}
        />
        <AddTodo addTodo={this.addTodo} />
        <hr />
        <TodoList
          todos={todos}
          doers={DOERS}
          markTodo={this.markTodo}
          deleteTodo={this.deleteTodo}
        />
      </div>
    );
  }
}
