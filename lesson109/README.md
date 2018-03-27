# Redux

> 只有遇到 React 实在解决不了的问题，你才需要 Redux. --Dan Abramov

## 预备知识

* 本文你需要拥有 React 基础，如果了解 Flux 则更好；
* Node 基础，能够使用 `node` | `npm` 等命令；

## Redux 基础概念及 API

正如 [Rainsho](https://github.com/Rainsho) 在 [lesson107](../lesson107/README.md) 中说的，React 是一个 View 层解决方案，并不适合大型应用，处理复杂的组件间通信会变的一团乱麻。所以 2014 年 Facebook 提出了 Flux 架构的概念，而 Redux 是 Flux 的一个社区实现，发布后很短时间内就成为了最热门的前端框架。

Redux 中的基本概念和 API：

1.  Action/Action Creator

    Action 是行为的抽象，是一个简单的 JS 对象，所有的 Action 都必须有一个 type。在系统中视图要发送多少种消息就会有多少种 Action，通常使用一个函数来生成 Action，这个函数就叫做 Action Creator，这里有点类似 Java 中的对象工厂。下面代码中 `createLoginAction` 就是一个 Action Creator，该函数的返回结果就是一个 Action，Action 是一个对象。

    ```javascript
    export function createLoginAction(name, pswd) {
      return {
        type: LOGIN,
        payload: { name, pswd },
      };
    }
    ```

2.  Store

    Store 简单来说就是数据存储的地方,Action 作用于 Store，然后 Store 根据 Action 找到对应的 Reducer 来处理，根据 Rducer 反回的新 State 作用于 View 的渲染。一个应用有一个 Store！一个应用只有一个 Store！一个应用只有一个 Store！Store 有以下几个主要的 API:

    * `createStore()` 用于创建 Store，入参通常是整个项目的根 Reducer。
    * `getState()` 用于获取当前应用的 State。
    * `store.dispatch()` view 通过该方法发出 Action，入参是 Action，Action 通过该方法作用于 Store。
    * `store.subscribe()` 订阅一个监听器，当 Store 中 State 发生变化的时候触发监听器。

3.  Reducer

    Reducer 是行为的抽象，接受一个初始化的 State，和 view 发出的 Action，然后生成 NewState。Reducer 只能是一个*纯方法*，这意味着相同的 state ＋ 同一个 Action 多次触发 Reducer 得到的 NewState 必然是一样的。不要修改 state，返回新的 state，下面是 Todo App 中使用 Reducer 的截取部分用于处理用户登录的时候的 Reducer。
    Reducer 接收连个参数，初始化 state 和 action,根据 action type 进行对应的数据处理，然后返回新的 state。

    ```javascript
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

    Reducer 负责生成 State，整个应用只有一个 State，对大型应用来说必然及其庞大，Redux 为此提供了一个 `combineReducers` 方法，用于拆分 Reducer，从而可以更加细粒度的控制组件 State，从而更好的管理组件状态。详细使用方式可以参考 simpleDemo 下的 index.js 文件中的用法。

4.  middleware

    中间件就是在要处理的流程中（前或后）做增强功能，类似于 Java 的面向切面的编程。在 redux 中中间件就是一个函数，对 store.dispatch 方法进行了改造，在发出 Action 和执行 Reducer 这两步之间，添加了其他功能，如下面代码中使用 applayMiddleware 函数在创建 store 的时候织入日志中间件。

    ```javascript
    //定义日志中间件logger
    const logger = createLogger();

    //使用createStore()创建Store，应用logger中间件
    let store = createStore(counter, initState, applyMiddleware(logger));
    ```

5.  React-Redux

    Redux 本身和 React 没有必然联系，React 是一个 View 层解决方案，Redux 是数据层方案，如果要在项目中将 Redux 和 React 相结合，需要一个新的第三方框架 React—Redux，React－Redux 不作为本篇的主要功能介绍，这里只简单的介绍几个 api，具体的使用方式可以参考改节课程 demo 中的用法。 - Provider; Provider 用于让容器组件拿到 state，如下面代码，TodoApp 组件内的所有子组建都可以拿到 state。

    ```javascript
    const store = configureStore();

    ReactDOM.render(
      <Provider store={store}>
        <TodoApp />
      </Provider>,
      document.getElementById('root')
    );
    ```

    * `connect` 用于从 UI 组件生成容器组件，connect 的意思就是连接，将这两种组件链接起来，如下代码，connect 接受两个参数，一个是 mapStateToProps，将 UI 组件的 state 映射入 props，一个是 mapDispatchToProps，用于将 UI 组件的行为映射为 props。

    ```javascript
    const mapStateToProps = state => ({
      data: {
        todos: state.TodoReducer.todos,
        doers: state.TodoReducer.doers,
        doer: state.TodoReducer.doer,
        errMsg: state.TodoReducer.errMsg,
      },
    });

    const mapDispatchToProps = dispatch => ({
      actions: bindActionCreators(TodoActions, dispatch),
    });

    export default connect(mapStateToProps, mapDispatchToProps)(App);
    ```

## 代码解析

这里只对 simpleDemo 下的简单代码进行解析，来阐述 Redux 中概念以及 api 的使用，笔者同样使用 Redux + React-Redux 改造了 Lesson106 中的 Todo App，供读者参考学习。

simpleDemo 下的简单 Demo 是一个后端代码，可以使用简单的命令行来进行运行验证。执行 `npm install` 安装运行所依赖的第三方库。在 simpleDemo 目录下运行 `npm index.js`  。

创建 counterAdd，counterSub 两个 Reducer，使用 combineReducers 将两个 reducers 合并为一个。使用 createStore()来创建 store，改函数拥有三个参数，第一个是应用的 reducer，第二个是初始化 state(可以不传，如果传入会覆盖 ruducer 中的 state),第三个参数传入要引用的中间件。然后使用 subscribe 方法订阅标准输出，输出当前 state 中两个 reducer 中的 counter 数据(每一个 reducer 中的 state 在 store 中都有一个与 reducer 同名的对象保存，所有 reducer 中的数据共同组成 store 中的数据)。使用 dispatch 方法主动触发 action，此时可以看到标准输出中 state 的信息以及日志信息，日志辅助输出执行 action 之前的 state，执行了什么 action 以及执行 action 之后的 state。

```javascript
const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const combineReducers = require('redux').combineReducers;
const createLogger = require('redux-logger').createLogger;

//初始化的state
const initState = {
  counter: 0,
};

//将counter拆分成两个reducer，这里业务上并不需要，只是为了演示combineReducers api做的简单拆分
function counterAdd(state = initState, action) {
  switch (action.type) {
    case 'INCREMENT':
      let counter = state.counter + 1;
      let temp = { counter: counter };
      return Object.assign({}, state, temp);
    default:
      return state;
  }
}

function counterSub(state = initState, action) {
  switch (action.type) {
    case 'DECREMENT':
      let counter1 = state.counter - 1;
      let temp1 = { counter: counter1 };
      return Object.assign({}, state, temp1);
    default:
      return state;
  }
}

//使用combineReducers 将拆分后的reducer合并成一个
const counter = combineReducers({ counterAdd, counterSub });

//定义日志中间件logger
const logger = createLogger();

//使用createStore()创建Store，应用logger中间件
let store = createStore(counter, initState, applyMiddleware(logger));

//订阅，每当store发生变化时候出发函数调用
store.subscribe(() =>
  console.log(store.getState().counterAdd.counter, store.getState().counterSub.counter)
);

//使用dispatch分发action，这里是手动触发，真实业务场景中一般使用页面的事件进行触发
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
```

## 总结

文章对 Redux 基本概念和如何使用做了简单的介绍，同时结合 React，Redux，React-Redux 对 Todo APP 做了 Redux 版本的实现，能够让读者对 Redux 和 Redux 的使用有简单的认识和了解，能够给读者在实践中是否引入 Redux 以及如何引入 Redux 做了简单的介绍。关于 Redux 仍然有很多可以拓展的，但是遵循 2-8 原则，这里能覆盖 80% 的使用场景。这里没有覆盖到，但是仍然应用比较广发的场景包括异步数据处理，Rainsho 应该会在以后的章节中介绍，大家也可以参考扩展阅读进行学习。

## 扩展阅读

1.  [阮一峰: Redux 入门教程（二）#中间件与异步操作](http://es6.ruanyifeng.com/#docs/intro#语法提案的批准流程)

下一章: [整合 Router & Intl](../lesson110/README.md)
