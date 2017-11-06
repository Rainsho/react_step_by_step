# Redux
>只有遇到 React 实在解决不了的问题，你才需要 Redux.         --Dan Abramov 

## Target audiences
- 本文你需要拥有React基础，如果了解Flux则更好；
- 单的Node基础，能够使用node npm等命令；

## What
正如Rainsho在lesson107中说的，React是一个View层解决方案，并不适合大型应用，处理复杂的组件间通信会变的一团乱麻。所以2014年Facebook提出了Flux架构的概念，而Redux是Flux的一个社区实现，发布后很短时间内就成为了最热门的前端框架。

Redux中的基本概念和API：
1. Action/Action Creator
Action是行为的抽象，是一个简单的JS对象，所有的Action都必须有一个type。在系统中视图要发送多少种消息就会有多少种Action，通常使用一个函数来生成Action，这个函数就叫做Action Creator，这里有点类似Java中的对象工厂。下面代码中createLoginAction就是一个Action Creator，改函数的返回结果就是一个Action。
    ```
     export function createLoginAction(name, pswd) {
      return {
        type: LOGIN,
        payload: {
          name, pswd,
        },
      };
    }
    ```

2. Store
Store简单来说就是数据存储的地方,Action作用于Store，然后Store根据Action找到对应的Reducer来处理，根据Rducer反回的新State作用于View的渲染。一个应用有一个Store！一个应用只有一个Store！一个应用只有一个Store！Store有以下几个主要的API:
   - createStore();用于创建Store，入参通常是整个项目的根Reducer。
   - getState(); 用于获取当前应用的State。
   - store.dispatch(); view通过该方法发出Action，入参是Action，Action通过该方法作用于Store。
   - store.subscribe(); 订阅一个监听器，当Store中State发生变化的时候触发监听器。
3. Reducer
Reducer是行为的抽象，接受一个初始化的State，和view发出的Action，然后生成NewState。Reducer只能是一个*纯方法*，这意味着相同的state＋同一个Action多次触发Reducer得到的NewState必然是一样的。不要修改state，返回新的state，下面是Todo App中使用Reducer的截取部分用于处理用户登录的时候对state产生的作用。
    ```
    const initState = {
      todos,
      doers,
      doer: null,
      errMsg: null,
    };

    export default function TodoReducer(state = initState, action) {
      let doer;
      let name;
      let pswd;
      const tempState = state;
      switch (action.type) {
        case LOGIN:
          name = action.payload.name;
          pswd = action.payload.pswd;
          doer = find(state.doers, { name });
          if (doer) {
            if (doer.pswd === pswd) {
              tempState.doer = doer;
            } else {
              tempState.errMsg = 'password do not match';
            }
          } else {
            tempState.errMsg = 'user not exist!';
          }
          return Object.assign({}, tempState);
        default:
          return state;
      }
    }
    ```
   Reducer负责生成State，整个应用只有一个State，对大型应用来说必然及其庞大，Redux为此提供了一个combineReducers方法，用于拆分Reducer，从而可以更加细粒度的控制组件State，从而更好的管理组件状态。详细使用方式可以参考simpleDemo下的index.js文件中的用法。
4. middleware

## Why

## How
了解了Redux及其基本概念以及使用Redux的种种好处之后，简单介绍一下如何使用Redux，如何将Redux和React相结合使用。Redux本身和React没有必然联系，React是一个View层解决方案，Redux是数据层方案，如果要在项目中讲Redux和React相结合，需要一个新的第三方框架React—Redux。
    - React-Redux
        - 简介 
        - Provider
        - Connect
    - 应用步骤



## 代码解析
    这里只对simpleDemo下的简单代码进行解析，来阐述Redux中概念以及api的使用，笔者同样使用Redux+React-Redux改造了Lesson106中的Todo App，供读者参考学习。
    
    simpleDemo下的简单Demo是一个后端代码，可以使用简单的命令行来进行运行验证。执行 `npm install` 安装运行所依赖的第三方库。在simpleDemo目录下运行 `npm index.js `。
    
    
    
    ```
    const createStore = require('redux').createStore;
    const applyMiddleware = require('redux').applyMiddleware;
    const combineReducers = require('redux').combineReducers;
    const createLogger = require('redux-logger').createLogger;

    //初始化的state
    const initState = {
      counter:0
    }

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

    ```

## 扩展阅读
1. [阮一峰: Redux入门教程（二）#中间件与异步操作](http://es6.ruanyifeng.com/#docs/intro#语法提案的批准流程)


下一章: [Ant-Design](../lesson110/README.md)

