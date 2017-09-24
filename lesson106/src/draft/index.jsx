import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './UIDraft';
import { todos } from '../../api/data';

ReactDOM.render(
  <TodoApp todos={todos} />,
  document.getElementById('root'),
);
