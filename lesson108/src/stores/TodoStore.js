import uuid from 'uuid';
import find from 'lodash/find';
import { observable, action, useStrict } from 'mobx';
import { todos, doers } from '../constants/MockData';

useStrict(true);

class Store {
  @observable todos = todos;

  @observable doers = doers;

  @observable doer = null;

  @observable errMsg = null;

  @action
  login(name, pswd) {
    if (!name || !pswd) {
      this.errMsg = 'where is your password';
      return;
    }
    let doer = find(this.doers, { name });
    if (!doer) {
      doer = { uid: uuid.v4(), name, pswd };
      this.doers.push(doer);
      this.doer = doer;
      return;
    }
    if (doer.pswd === pswd) {
      this.doer = doer;
    } else {
      this.errMsg = 'password do not match';
    }
  }

  @action
  logout() {
    this.doer = null;
    this.errMsg = null;
  }

  @action
  addTodo(content) {
    const uname = this.doer
      ? this.doer.name
      : this.doers[0].name;
    this.todos.push({ tid: uuid.v4(), done: false, uname, content });
  }

  @action.bound
  markTodo(tid) {
    this.todos = this.todos.map((x) => {
      if (x.tid !== tid) return x;
      return { ...x, done: !x.done };
    });
  }

  @action.bound
  deleteTodo(tid) {
    this.todos = this.todos.filter(x => x.tid !== tid);
  }
}

export default new Store();
