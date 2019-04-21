/*eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';

const Counter = ({
  value,
  onIncrement,
  onDecrement,
  onIncrementAsync,
  onIncrementLatest,
  action,
}) => (
  <div>
    <button onClick={onIncrementAsync}>Increment after 1 second</button>
    <button onClick={onIncrementLatest}>Increment Latest after 1 second</button>
    <button onClick={onIncrement}>Increment</button>{' '}
    <button onClick={onDecrement}>Decrement</button>
    <button onClick={() => action('LOGIN_REQUEST')}>LOGIN_REQUEST</button>
    <button onClick={() => action('LOGOUT')}>LOGOUT</button>
    <button onClick={() => action('ALL')}>ALL</button>
    <button onClick={() => action('RACE')}>RACE</button>
    <button onClick={() => action('CANCEL_TASK')}>CANCEL_TASK</button>
    <button onClick={() => action('ACHAN')}>ACHAN</button>
    <button onClick={() => action('ECHAN')}>ECHAN</button>
    <button onClick={() => action('MCHAN')}>MCHAN</button>
    <button onClick={() => action('THROTTLE')}>THROTTLE</button>
    <hr />
    <div>Clicked: {value} times</div>
  </div>
);

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
};

export default Counter;
