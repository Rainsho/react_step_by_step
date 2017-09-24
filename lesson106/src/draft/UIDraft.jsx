import React from 'react';

function TodoView({ uid, content }) {
  return (
    <div>
      <input type="checkbox" />
      <span>{uid}</span>
      <span>{content}</span>
      <a href="#">delete</a>
    </div>
  );
}

function TodoList({ todos }) {
  if (todos.length === 0) return null;
  return (
    <div>
      {todos.map(x => <TodoView key={x.tid} {...x} />)}
    </div>
  );
}

function AddTodo() {
  return (
    <div>
      <input type="text" />
      <button>Add Todo</button>
    </div>
  );
}

function Doer({ doer, errMsg }) {
  if (doer) {
    return (
      <div>
        <span>{`Welecome: ${doer.name}`}</span>
        <a href="#">Logout</a>
      </div>
    );
  }
  return (
    <div>
      <label>name: </label><input type="text" />
      <label>password: </label><input type="text" />
      <button>Regist/Login</button>
      <span>{errMsg}</span>
    </div>
  );
}

function TodoApp({ todos }) {
  return (
    <div>
      <h1>Todo List</h1>
      <Doer />
      <AddTodo />
      <hr />
      <TodoList todos={todos} />
    </div>
  );
}

export default TodoApp;
