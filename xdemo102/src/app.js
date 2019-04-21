import React from 'react';
import { connect } from 'react-redux';

const App = ({ state, dispatch }) => (
  <div>
    <h1>{state}</h1>
    <button onClick={() => dispatch({ type: 'ADD_COUNT' })}>add</button>
    <button onClick={() => dispatch({ type: 'FIND_COUNT' })}>find</button>
  </div>
);

export default connect(state => ({ state }))(App);
