import { takeEvery, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { addTodo } from './TodoAction';

function asyncGetString() {
  return new Promise((res, rej) => {
    const r = Math.random();
    if (r > 0.2) return setTimeout(res, 2000);
    return setTimeout(rej, 1000);
  })
    .then(() =>
      Math.random()
        .toString(16)
        .substr(-10)
    )
    .catch(() => {
      console.log('pretend fail...');
    });
}

function* asyncAddTodo(action) {
  try {
    const content = yield call(asyncGetString);
    if (!content) throw new Error();
    yield put(addTodo(action.payload.uid, content));
  } catch (e) {
    console.log('catch error');
  }
}

export function* everySaga() {
  yield* takeEvery('SAGA_TEST_EVERY', asyncAddTodo);
}

export function* latestSaga() {
  yield* takeLatest('SAGA_TEST_LATEST', asyncAddTodo);
}
