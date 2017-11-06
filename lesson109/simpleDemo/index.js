const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const combineReducers = require('redux').combineReducers;
const createLogger = require('redux-logger').createLogger;

//初始化的state
const initState = {
  counter:0
}

/*
function counter(state = initState, action){
  switch(action.type){
    case 'INCREMENT':
      let counter = state.counter + 1;
      let temp = {counter : counter}
      return Object.assign({},state,temp)
    case 'DECREMENT':
      let counter1 = state.counter - 1;
      let temp1 = {counter : counter1}
      return Object.assign({},state,temp1)
    default:
      return state
  }
}
*/

//将counter拆分成两个reducer，这里业务上并不需要，只是为了演示combineReducers api做的简单拆分
function counterAdd(state = initState,action){
  switch(action.type){
    case 'INCREMENT':
      let counter = state.counter + 1;
      let temp = {counter : counter}
      return Object.assign({},state,temp)
    default:
      return state
  }
}

function counterSub(state = initState,action){
  switch(action.type){
    case 'DECREMENT':
      let counter1 = state.counter - 1;
      let temp1 = {counter : counter1}
      return Object.assign({},state,temp1)
    default:
      return state
  }
}

//使用combineReducers 将拆分后的reducer合并成一个
const counter = combineReducers({counterAdd,counterSub})

//定义日志中间件logger
const logger = createLogger();

//使用createStore()创建Store，应用logger中间件
let store = createStore(counter,initState,
applyMiddleware(logger));

//订阅，每当store发生变化时候出发函数调用
store.subscribe(() => console.log(store.getState().counterAdd.counter,store.getState().counterSub.counter));

//使用dispatch分发action，这里是手动触发，真实业务场景中一般使用页面的事件进行触发
store.dispatch({ type: 'INCREMENT'});
store.dispatch({ type: 'INCREMENT'});
store.dispatch({ type: 'DECREMENT'});

