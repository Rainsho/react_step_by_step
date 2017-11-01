import React from 'react';
import ReactDOM from 'react-dom';
import '../res/style/main.css';
import { Provider } from 'react-redux';
import TodoApp from './containers/App';
import configureStore from './store/configureStore';
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('root'),
);
