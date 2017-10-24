import React from 'react';
import ReactDOM from 'react-dom';
import '../res/style/main.css';
import { Provider } from 'react-redux';
import { TodoApp } from './components/TodoApp';
import { todos, doers } from '../constants/MockData';

const initState = {
  todos,
  doers,
  doer: null,
  errMsg: null,
};

const store = configureStore(initState)

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('root'),
);