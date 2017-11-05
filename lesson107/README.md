# Flux

如果你看到这里了，我觉得你一定是个真的勇士。从这一章开始，我们的代码将更有实用性，也会去讨论一些 React 还不完善
的地方。以及一些更接近真实业务场景的问题的处理方式。

## Flux 概念介绍

在 lesson106 的内容中，如果大家还有印象的话就会发现，我们的标记和删除 todo 的两个方法 
(`markTodo` 和 `deleteTodo`) 的具体实现是在 `TodoApp` 组件内部，而实际调用却是在 `TodoView` 组件内部。而且，
在传递过程中，还经过了 `TodoList` 这个组件。组件间的通讯，其实一直都是 React 比较头疼的一个环节。究其原因也不难发现， 
React 的核心思想是 View 是 state 的输出，或者说是将图形界面（GUI）函数化，归根到底其是一个优秀的 View 层解决方案，
而在我们之前的代码中，它也同时也充当了 Controller 甚至是 Model 层的角色。当我们面对的项目越来越复杂，这种通过 `props` 
传递方法到子组件去改变 state tree 的方法，不但不方便也很难管理。

正是在这样的背景下， Facebook 官方提出了 Flux 架构的概念，其核心概念是**单向数据流**的设计模式，由 React 主要负责 
View 部分，而搭配基于 Flux 的概念实现的框架进行 state 的管理。当然 Flux 准确的来说只能算一个概念，其具体的实现多如
牛毛，我们在后面的内容中也会重点介绍目前最流行的两个框架 MobX 和 Redux 。

回到 Flux ，简单的来讲其核心思想就是: 

* 不同组件的 `state` ，存放在一个外部的、公共的 Store 上面
* 组件订阅 Store 的不同部分
* 组件发送（dispatch）动作（action），引发 Store 的更新

## Flux 流程

Flux 流程如下: Action -> Dispatcher -> Store -> View

![flux-simple-diagram](./pic/flux-simple-diagram.png)

1. Action / Action Creator

Action 用来描述一个行为及相关信息，其本质是只是一个**普通的 JS 对象**，广义上讲可以是任意的结构。这里社区为了提高各个
第三方开源库的兼容性，提出了一种叫做 Flux Standard Action 的标准规范，这样的 Action 通常具备 `type` 用来表示所触发
的行为，和 `payload` 用来携带相关的信息。在实际项目中，当程序复杂度比较高时，可能导致在不同的 view 中发送相同的 Action ，
鉴于此 Flux 提出了 Action Creator 的概念，通过 Action Creator 将 Action 送给 Dispatcher ，Action Creator 本质
上是一个返回 Action 的函数。

```javascript
// Action
{
  type: 'ADD_TODO',
  payload: {
    content: 'sleep'
  },
}

// Action Creator
const TodoAction = {
  /**
   * 这里的 addTodo 方法直接接受一个传入的 content
   * 然后构造一个 type 为 'ADD_TODO'
   * payload 为 { content: content } 的 Action
   * 然后交个 Dispatcher 去分发
   */
  addTodo(content) {
    TodoDispatcher.dispatch({
      type: 'ADD_TODO',
      payload: {
        content,
      },
    });
  }
};
```

2. Dispatcher

Dispatcher 是 Flux 架构的核心，负责连接 Action 和 Store ，其内建有 `dispatch` 和 `subscribe` 方法，
使用 `dispatch` 方法执行 Action ，使用 `register` 方法注册回调，并在回调中对 Store 进行处理。
简单来讲， `dispatch` 进来的所有 Action 会进入 `register` 注册的方法中，通过 Action 的 `type` 区分做不同的处理。
每个 App 只有一个 Dispatcher 。

3. Store

Store 用来操作和储存业务数据，并在变化后通知 View 展示新的数据。通过类似订阅-发布 (Pub-Sub) 模式，可以借助 Node.js 标准库的 
EventEmitter (可通过 Babel 转码成浏览器端兼容的代码) 在 Store 中添加这一特性。在处理完数据后，通过 `emit` 发送广播，告知 
Store 的改变。

4. View

这部份是 React 负责的范畴，核心是使用 Store 的数据渲染真实 DOM 。在其内部通过 Store 包装的 EventEmitter 注册监听事件的 
`callback` 回调，当相关事件发生后更新 state 。

小结一下 Flux 的流程：当用户在 View 上有一个交互时，触发事件， Action Creator 发送 Action 给 Dispatcher ， Dispatcher 
里注册了各种类型的 Action ，在对应的类型中 Store 对该 Action 进行响应，对数据做相应处理，然后触发一个自定义事件，同时在 View 
内部，通过对该事件注册回调响应数据的更新，并重新渲染界面。

## 代码解析

了解了 Flux 的基本流程后，接下来让我们用 Flux 的框架改写我们 lesson106 里的代码。

首选我们还是配置环境，这里就基本上延续了我们在 lesson106 中的配置，只是在 package.json 中额外的引入了三个库。

```bash
$ npm install --save flux lodash uuid
```

`flux` 就不用多说了，将用来负责 state 的维护。而 `lodash` 则是一款优秀的前端工具库，提供了诸如循环、查找、克隆、对象比较等基础功能的便捷
实现，也有计算结果缓存、链式延迟计算等高级特性，灵活合理的使用可以大大减少不必要的冗余代码，并且其对入参的多种形式的支持使得容错性更好。
简单的入门和官方文档，我放在下面的扩展阅读内了，有兴趣的可以查看。最后我们使用 `uuid` 这个前端库，来为我们新生成的 `Todo` 和 `Doer` 生成
对应 ID (后期合入后端功能后，可以使用数据库的自增主键作为 ID ) 。

安装好需要的依赖后，我们规整下我们的文件夹结构。我们首先在根目录下建立 src 和 res 分别用来放置 `script` 和 `resource` ，前者为我们的
代码文件，后者为需要使用的资源文件比如 css 和 图片等。在 src 目录下面，我们依次建立 actions 、 dispatcher 、 stores 分别用来存放如
其名字所述的部分，同时新建 components 用来存放我们的 React 组件。最后，因为 Flux 使用 Action.type 区分不同的 Action ，我们新建 
constants 文件夹用来声明和保存 Action.type 等常量，避免编码过程中的低级错误。规整后的文件夹结构大致如下：

```bash
.
├── res
│   └── style
├── src
│   ├── actions
│   ├── components
│   ├── constants
│   ├── dispatcher
│   ├── stores
│   └── index.jsx
├── .babelrc
├── .eslintrc
├── index.html
├── package.json
└── webpack.config.js
```

接下来我们按流程去实现各部分功能。

1. 首先是 dispatcher 用来触发 action 和给 store 注册回调函数。

```javascript
// ./src/dispatcher/TodoDispatcher.js
import { Dispatcher } from 'flux';
export default new Dispatcher();
```

这里我们直接使用原生的 `Dispatcher` (当业务比较复杂或者有其他定制的话，可以定义一个类继承原生的 `Dispatcher` 然后扩展)，新建一个
实例并输出 (这里留个坑，为什么 `export new Dispatcher()` 导出的是一个唯一的 `dispatcher` )。

2. 其次是 action，通过定义一些 `action creator` 方法根据需要创建 Action 提供给 `dispatcher` 。

我们在 constants 目录下新建常量，用 `ActionTypes` 来表示我们可能会用到的 action type 。

```javascript
// ./src/constants/ActionTypes.js
const LOGIN = 'LOGIN';              // 用户登陆
const LOGOUT = 'LOGOUT';            // 用户登出
const ADD_TODO = 'ADD_TODO';        // 新增TODO
const MARK_TODO = 'MARK_TODO';      // 标记TODO
const DELETE_TODO = 'DELETE_TODO';  // 删除TODO

export { LOGIN, LOGOUT, ADD_TODO, MARK_TODO, DELETE_TODO };
```

我们在 actions 目录下定义使用 `action creator` 生成 action ，同时使用 `TodoDispatcher` 原生的 `dispatch` 方法，发送 action 。
这里可以使用对象的形式，当然也可以使用如上面的 action type 的生成方法，依次定义方法然后输出。

```javascript
// ./src/actions/TodoAction.js
import TodoDispatcher from '../dispatcher/TodoDispatcher';
import { LOGIN } from '../constants/ActionTypes';
const TodoAction = {
  /* ... */
  deleteTodo(tid) {
    TodoDispatcher.dispatch({
      type: DELETE_TODO,
      payload: {
        tid,
      },
    });
  },
  /* ... */
};
export default TodoAction;
```

3. 然后是 view 层通过用户交互 (如 `onClick` 事件) 触发 action 。

我们在 `TodoView` 组件内点击删除(x)按钮，实际上就是触发了 `type` 为 `DELETE_TODO` 的 action ，其对于的 `action creator` 方法
就是 `action.deleteTodo` 。于是在 `TodoView` 内部我们就可以这样写。

```javascript
// ./src/components/TodoView.jsx
import action from '../actions/TodoAction';
function TodoView({ todo }) {
  /* ... */
  return (
    <div className="todo-view">
      {/* ... */}
      <span><button
        onClick={() => { action.deleteTodo(tid); }}
      >x</button></span>
      {/* ... */}
    </div>
  );
}
```

4. 接着是 store 根据接收的 action 更新自身数据之后会触发一个 `change` 事件通知 view 数据更改了。

store 主要用来储存数据和处理业务逻辑，由于其需要实现订阅-发布模式，因此我们让其继承 `events` 模块下的 `EventEmitter` 。当 `action` 传入 
`Dispatcher` 注册 `register` 的处理范围后，根据 `action type` 选择对应的方法对 `store` 进行处理，处理完后通过 `emit` 方法通知 view 
数据已更改。

```javascript
// ./src/stores/TodoStore.js
import uuid from 'uuid';
import find from 'lodash/find';
import EventEmitter from 'events';
/* ... */

// store 的初始数据
const store = {
  todos,
  doers,
  doer: null,
  errMsg: null,
};

// store 类通过继承 `events` 下的 `EventEmitter` 实现订阅-发布模式
// 同时选择性的定义可输出的数据，这里不对外暴露 doers 集合
class TodoStoreClass extends EventEmitter {
  getTodos() {
    return store.todos;
  }

  getDoer() {
    return store.doer;
  }

  getErrMsg() {
    return store.errMsg;
  }
}

const TodoStore = new TodoStoreClass();

// 通过 Dispatcher 原生的 register 方法注册在 dispatch 后对不同 action 的处理方式
TodoDispatcher.register((action) => {
  switch (action.type) {
    case LOGIN: {                                 // 处理 type 为 LOGIN 的 action
      const { name, pswd } = action.payload;
      if (!name || !pswd) {
        store.errMsg = 'where is your password';
        TodoStore.emit(DOER_CHANGE);              // 通知监听了 DOER_CHANGE 的 view 数据已更新
        return;
      }
      let doer = find(store.doers, { name });     // 使用 lodash 库里的 find 方法根据 name 查找 doer
      if (!doer) {
        doer = { uid: uuid.v4(), name, pswd };    // 使用 uuid 库里的 v4 方法生成一个随机的 ID
        store.doers.push(doer);
        store.doer = doer;
        TodoStore.emit(DOER_CHANGE);
        return;
      }
      if (doer.pswd === pswd) {
        store.doer = doer;
      } else {
        store.errMsg = 'password do not match';
      }
      TodoStore.emit(DOER_CHANGE);
      break;
    }
    /* ... */
    default:
  }
});

export default TodoStore;
```

5. 最后是 view 通过监听 store 的 `change` 拿到新的数据并更新 state 。

```javascript
// ./src/components/DoerInfo.jsx

export default class DoerInfo extends React.Component {
  /* ... */
  componentDidMount() {                 // didMount 后注册监听
    store.on(DOER_CHANGE, () => {       // 注册对 DOER_CHANGE 事件的监听
      this.setState({                   // 监听的回调 (store.emit 后执行)
        doer: store.getDoer(),          // 从 store 内拿到新的 doer 并更新 DoerInfo 内的 state
        errMsg: store.getErrMsg(),      // 从 store 内拿到新的 errMsg 并更新 DoerInfo 内的 errMsg
      });
    });
  }

  componentWillUnmount() {              // willUnount 时删除监听释放资源
    store.removeListener(DOER_CHANGE);
  }
  /* ... */
}
```

经过以上 5 个步骤，一套符合 Flux 哲学的单向数据流循环就实现了，各个部分分工明确高度解耦了。并且这种单向数据流使得
整个系统都是透明可预测的。当然细心的同学可能会发现，我们并非所有的状态都由 store 在负责维护，比如 `AddTodo` 内的 `content` 以及 
`DoerInfo` 内的 `name` 和 `pswd` ，这是因为以上三个状态仅在对应组件的内部进行使用，通过对应的 `onChange` 在内部进行维护即可。
当然有兴趣(~~比我还强迫症~~)的同学可以考虑也将其抽象到 store 内部进行管理。

好了，现在我们 `npm install` 然后 `npm run start` 等待编译完成后浏览器将自动打开，即可看到我们用 Flux 改写的 Todo List v2.0 。

ps: 可能第一次接触 Flux 会觉得很抽象，甚至疑惑这个框架到底有什么好处。 Flux 确实没有简化代码，对于简单小应用来说甚至是复杂化了。
但 Flux 设计模式的优势在于其清楚的架构和分工，这就使得应用更易于扩展，这对于复杂的中大型应用是很重要的。也鉴于此为了让 Flux 架构更加
简洁，在开发社区中产生了许多 Flux-like 的架构和函式库，接下来将我们将向大家介绍目前最热门的架构: MobX 和 Redux 。

## 扩展阅读

1. [Flux 官方网站](https://facebook.github.io/flux/)
1. [Lodash 入门](http://www.jianshu.com/p/d46abfa4ddc9)
1. [Lodash API](https://lodash.com/docs/4.17.4)

下一章: [MobX](../lesson108/README.md)
