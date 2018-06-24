import { delay, buffers, END, eventChannel, channel } from 'redux-saga';
import {
  put,
  takeEvery,
  all,
  call,
  takeLatest,
  take,
  select,
  fork,
  cancel,
  cancelled,
  race,
  actionChannel,
  throttle,
} from 'redux-saga/effects';

export function* helloSaga() {
  console.log('Hello Sagas!');
}

export function* incrementAsync() {
  yield call(delay, 1000);
  yield put({ type: 'INCREMENT' });
}

export function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

export function* watchLatestIncrementAsync() {
  yield takeLatest('INCREMENT_LATEST', incrementAsync);
}

// 监听 action
function* watchAndLog() {
  for (let i = 0; i < 0; i++) {
    yield take('INCREMENT');
    console.log('action', 'INCREMENT');
    yield take('DECREMENT');
    console.log('action', 'DECREMENT');
  }
  // for (let i = 0; i < 3; i++) {
  while (true) {
    const action = yield take('*');
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  }
}

// 无阻塞调用
function* authorize() {
  try {
    const token = yield new Promise(res => setTimeout(res, 1000, Math.random()));
    if (token > 0.4) {
      console.log('LOGIN_SUCCESS');
      yield put({ type: 'INCREMENT' });
    } else {
      throw token;
    }
  } catch (e) {
    console.log('LOGIN_ERROR');
    yield put({ type: 'LOGIN_ERROR', e });
  } finally {
    if (yield cancelled()) {
      console.log('cancelled');
    }
  }
}

function* loginFlow() {
  while (true) {
    yield take('LOGIN_REQUEST');
    const task = yield fork(authorize);
    const action = yield take(['LOGOUT', 'LOGIN_ERROR']);
    if (action.type === 'LOGOUT') {
      yield cancel(task);
    }
    console.log('LOGOUT');
    yield put({ type: 'DECREMENT' });
  }
}

// 并发
function* doAll() {
  while (true) {
    yield take('ALL');
    yield all([call(incrementAsync), call(incrementAsync), call(incrementAsync)]);
    yield call(incrementAsync);
    yield call(incrementAsync);
    yield call(incrementAsync);
  }
}

// race
function* raceTask() {
  while (true) {
    yield take('RACE');
    const obj = yield race({
      task: call(incrementAsync),
      cancel: take('CANCEL_TASK'),
    });
    console.log(obj);
  }
}

// action channels & queue
function* watchRequests() {
  const chan = yield actionChannel('ACHAN', buffers.dropping(2));
  while (true) {
    yield take(chan);
    yield call(incrementAsync);
  }
}

// eventChannel
function countdown(secs) {
  return eventChannel(emitter => {
    const iv = setInterval(() => {
      secs -= 1;
      if (secs > 0) {
        emitter(secs);
      } else {
        // 这里将导致 channel 关闭
        emitter(END);
      }
    }, 1000);
    // subscriber 必须回传一个 unsubscribe 函数
    return () => {
      clearInterval(iv);
    };
  });
}

function* countdownEvent() {
  const chan = yield call(countdown, 30);
  try {
    while (true) {
      let seconds = yield take(chan);
      // e.g. websocket
      console.log(`countdown: ${seconds}`);
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
      console.log('countdown cancelled');
    }
  }
}

function* watchEvent() {
  while (true) {
    yield take('ECHAN');
    const task = yield fork(countdownEvent);
    yield take('LOGOUT');
    yield cancel(task);
  }
}

// 通讯 | 负载均衡
function* handleRequest(chan) {
  while (true) {
    yield take(chan);
    console.log('working');
    yield call(incrementAsync);
  }
}

function* watchChan() {
  // 创建一个 channel 来队列传入的请求
  const chan = yield call(channel);

  // 创建 3 个 worker 'threads'
  for (let i = 0; i < 3; i++) {
    yield fork(handleRequest, chan);
  }

  while (true) {
    yield take('MCHAN');
    console.log('call worker');
    yield put(chan, { type: 'SSS' });
  }
}

// 节流
function* watchInput() {
  yield throttle(500, 'THROTTLE', incrementAsync);
}

// 去抖 delay + fork & cancel

// 重试 for + return + throw

export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync(),
    watchLatestIncrementAsync(),
    watchAndLog(),
    loginFlow(),
    doAll(),
    raceTask(),
    watchRequests(),
    watchEvent(),
    watchChan(),
    watchInput(),
  ]);
}
