import React from 'react';
import ReactDOM from 'react-dom';
// import B from './LifeCycle';
import B from './Context';
import Portal from './Portal';

ReactDOM.render(
  <React.StrictMode>
    <B />
    <Portal>I should be stand with the sun(body) shoulder by shoulder!</Portal>
  </React.StrictMode>,
  document.body.appendChild(document.createElement('div'))
);
