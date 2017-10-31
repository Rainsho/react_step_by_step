const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const combineReducers = require('redux').combineReducers;
const createLogger = require('redux-logger').createLogger;

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

const counter = combineReducers({counterAdd,counterSub})

const logger = createLogger();
let store = createStore(counter,
applyMiddleware(logger));

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'INCREMENT'});
store.dispatch({ type: 'INCREMENT'});
store.dispatch({ type: 'DECREMENT'});

