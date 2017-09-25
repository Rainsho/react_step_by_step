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
    if (!name || !pswd) return this.setState({ errMsg: 'where is your password' });
    let doer = null;
    for (let x in DOERS) {
      if (DOERS[x].name === name) {
        doer = DOERS[x];
        break;
      }
    }
    if (!doer) {
      doer = { name, pswd };
      const uids = Object.keys(DOERS);
      doer.uid = uids[uids.length - 1].uid + 1;
      DOERS[doer.uid] = doer;
      this.setState({ doer, errMsg: '' });
      return;
    }
    if (doer.pswd === pswd) {
      this.setState({ doer, errMsg: '' });
    } else {
      this.setState({ errMsg: 'password do not match' });
    }
  }

  logout() {
    this.setState({ doer: null });
  }

  addTodo(content) {
    const doer = this.state.doer || DOERS[0];
    const todos = [...this.state.todos];
    const tid = todos.length === 0
      ? 0
      : todos[todos.length - 1].tid + 1;
    const todo = { uid: doer.uid, done: false, tid, content };
    todos.push(todo);
    this.setState({ todos });
  }

  markTodo(tid) {
    let todos = [...this.state.todos];
    todos = todos.map(x => {
      if (x.tid !== tid) return x;
      x.done = !x.done;
      return x;
    });
    this.setState({ todos });
  }

  deleteTodo(tid) {
    let todos = [...this.state.todos];
    todos = todos.filter(x => x.tid !== tid);
    this.setState({ todos });
  }

  render() {
    const todos = [...this.state.todos];
    const { doer, errMsg } = this.state;
    return (
      <div>
        <h1>Todo List</h1>
        <DoerInfo
          doer={doer}
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
