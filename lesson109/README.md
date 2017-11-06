# Redux
>只有遇到 React 实在解决不了的问题，你才需要 Redux.         --Dan Abramov 

## Target audiences
- 本文你需要拥有React基础，如果了解Flux则更好；
- Node基础，能够使用node npm等命令；

## Redux基础概念及API
正如Rainsho在lesson107中说的，React是一个View层解决方案，并不适合大型应用，处理复杂的组件间通信会变的一团乱麻。所以2014年Facebook提出了Flux架构的概念，而Redux是Flux的一个社区实现，发布后很短时间内就成为了最热门的前端框架。

Redux中的基本概念和API：
1. Action/Action Creator
Action是行为的抽象，是一个简单的JS对象，所有的Action都必须有一个type。在系统中视图要发送多少种消息就会有多少种Action，通常使用一个函数来生成Action，这个函数就叫做Action Creator，这里有点类似Java中的对象工厂。下面代码中createLoginAction就是一个Action Creator，该函数的返回结果就是一个Action，Action是一个对象。
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
Reducer是行为的抽象，接受一个初始化的State，和view发出的Action，然后生成NewState。Reducer只能是一个*纯方法*，这意味着相同的state＋同一个Action多次触发Reducer得到的NewState必然是一样的。不要修改state，返回新的state，下面是Todo App中使用Reducer的截取部分用于处理用户登录的时候的Reducer。
Reducer接收连个参数，初始化state和action,根据action type进行对应的数据处理，然后返回新的state。
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

5. React-Redux
    Redux本身和React没有必然联系，React是一个View层解决方案，Redux是数据层方案，如果要在项目中讲Redux和React相结合，需要一个新的第三方框架React—Redux。
     - Provider
     - Connect

## 代码解析
    这里只对simpleDemo下的简单代码进行解析，来阐述Redux中概念以及api的使用，笔者同样使用Redux+React-Redux改造了Lesson106中的Todo App，供读者参考学习。
    
    simpleDemo下的简单Demo是一个后端代码，可以使用简单的命令行来进行运行验证。执行 `npm install` 安装运行所依赖的第三方库。在simpleDemo目录下运行 `npm index.js `。
    
    创建counterAdd，counterSub两个Reducer，使用combineReducers将两个reducers合并为一个。使用createStore()来创建store，改函数拥有三个参数，第一个是应用的reducer，第二个是初始化state(可以不传，如果传入会覆盖ruducer中的state),第三个参数传入要引用的中间件。然后使用subscribe方法订阅标准输出，输出当前state中两个reducer中的counter数据(每一个reducer中的state在store中都有一个与reducer同名的对象保存，所有reducer中的数据共同组成store中的数据)。使用dispatch方法主动触发action，此时可以看到标准输出中state的信息以及日志信息，日志辅助输出执行action之前的state，执行了什么action以及执行action之后的state。
    
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

## 总结
文章对Redux基本概念和如何使用做了简单的介绍，同时结合React，Redux，React-Redux对Todo APP做了Redux版本的实现，能够让读者对Redux和Redux的使用有简单的认识和了解，能够给读者在实践中是否引入Redux以及如何引入Redux做了简单的介绍。关于Redux仍然有很多可以拓展的，但是遵循2-8原则，这里能覆盖80%的使用场景。这里没有覆盖到，但是仍然应用比较广发的场景包括异步数据处理，Rainsho应该会在以后的章节中介绍，大家也可以参考扩展阅读进行学习。


## 扩展阅读
1. [阮一峰: Redux入门教程（二）#中间件与异步操作](http://es6.ruanyifeng.com/#docs/intro#语法提案的批准流程)


下一章: [Ant-Design](../lesson110/README.md)

