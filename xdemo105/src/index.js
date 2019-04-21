import React from 'react';
import ReactDOM from 'react-dom';
import LifeCycle from './LifeCycle';
import Context from './Context';
import Portal from './Portal';
import Hooks from './Hooks';

ReactDOM.render(
  <React.StrictMode>
    <Hooks />
    <Context />
    <Portal>I should be stand with the sun(body) shoulder by shoulder!</Portal>
    <LifeCycle />
  </React.StrictMode>,
  document.body.appendChild(document.createElement('div'))
);
