import React from 'react';
import dva, { connect } from 'dva';
import { Router, Route } from 'dva/router';
import key from 'keymaster';

import 'babel-polyfill';

const app = dva();

app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    add(count) {
      return count + 1;
    },
    minus(count) {
      return count - 1;
    },
    cus(count, action) {
      return count + action.payload;
    },
  },
  effects: {
    *magic(action, { call, put }) {
      yield put({ type: 'cus', payload: 3 });
      const payload = yield call(() => new Promise(res => setTimeout(res, 1000, -1)));
      yield put({ type: 'cus', payload });
    },
  },
  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => dispatch({ type: 'cus', payload: ~~(Math.random() * 10) }));
    },
  },
});

const App = connect(({ count }) => ({
  count,
}))(function(props) {
  return (
    <div>
      <h2>{props.count}</h2>
      <button onClick={() => props.dispatch({ type: 'count/add' })}>+</button>
      <button onClick={() => props.dispatch({ type: 'count/minus' })}>-</button>
      <button onClick={() => props.dispatch({ type: 'count/cus', payload: 2 })}>++</button>
      <button onClick={() => props.dispatch({ type: 'count/magic' })}>+-</button>
    </div>
  );
});

app.router(({ history }) => {
  return (
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  );
});

app.start('#root');
