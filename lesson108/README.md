# MobX

在上一章我们介绍 Flux 的时候提到过， Flux 设计模式并没有简化代码，只是提出了一种易于扩展的架构和分工。这一章，我们就一起学习一下
基于 Flux 模式的一种简化实现 MobX 。老实说，在笔者第一次接触 MobX 的时候觉得其是一个很简单的库，也因此 MobX 的 demo 压根没做功能
划分，就只是单独抽离了一个 store 出来。最近通读了官方文档，才意识到 MobX 远比想象的强大。所以这里的定位就退到 MobX 的快速入门吧，
更多功能和更高级的用法，可能还是需要各位移步官方文档。

## MobX 概念介绍

MobX 的官方定义是 ***简单、可扩展的状态管理*** ，和 Redux 类似， MobX 实际上只是一个**状态管理**工具，与 React 并无强关联，也可以
用在任意其他的前端项目中。 MobX 的核心是观察者模式，即 MobX 负责主动的观察 store 内被观察者 (`observable`) 的变化，一旦 store 
有变化，观察者 (`observer`) 即刻察觉，从而产生对应的动作(在与 React 共同使用时，即时组件的重新渲染)。

在 React 的项目中，其构建了一种如下的单向数据流模式。用户交互触发 action ， action 导致 store 内的 state 被改变，从而使的组件
重新渲染 view 。

![action-state-view](./pic/action-state-view.png)

store 内的属性有两种，一种是前文提到的被观察属性 (`observable`) ，另一种是基于被观察属性自动计算得到的属性 (`computed`) 。在 lesson106 
里我们提到过 state 的设计原则中有一条是**最小粒度原则**，即任何可以通过计算得到的状态都不应该作为 state 。 MobX 引入 `computed` 可以说
也是这一思想的体现。例如我们可以定义一个 todo 的集合 `todos = observable([todo1, todo2])` ，而当我们需要使用 todo 总数时就可以直接
通过 `computed` 得到 `tatal = computed(() => todos.length)` 。

MobX 通过 mobx-react 与 React 建立联系，组件通过 `observer` 的包装转变成相应式组件，即可以主动感知 `observable` 的变化。
所谓响应式组件就是可以被 MobX 所追踪的属性访问，这里包括 `observer` 组件的 `render()` 方法和 `computed` 表达式。
值得注意的还有一点就是， MobX 只是追踪属性访问，而不是属性值。

```javascript
let obj = observable({ a: { b: { c: 1 } } });
// 这里 obj.a|obj.a.b|obj.a.b.c 即为可被观察的引用
// 对以上部分任意赋值都会被 MobX 观察到并对已 "追踪的属性访问" 产生作用
let b = obj.b ;
b = { c: 2 };
// 这里 obj.b 和 b 虽然都指向 obj.b 所指向的引用，但是 b 未被观察
// 所以当 b 重新指向一个新的对象后， MobX 不会做出任何响应
```

以上提到的 `observable` 、 `computed` 和 `observer` 就是 MobX 提供的最常用的 API 。通过以上三个 API 就可以搭建起一个最简单的 React 
应用。当然还有 `action` ，在严格模式下，所有修改 `observable` 的操作只能包裹在 `action` 之下才能执行，通俗的讲就是只有 action 才能触发 
state 的改变，从而引发 view 的更新。

```javascript
// MobX 的极简示例
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const todos = observable(['sleep', 'eat', 'code']);
const App = observer(
  ({todos}) => <ol>
    {todos.map(x => <li>{x}</li>)}
  </ol>
);

ReactDOM.render(<App todos={todos} />, document.body);
window.todos = todos;
todos[1] = 'drink'; // App 组件将重新渲染
```

## 修饰器

在介绍 MobX 常用 API 之前，首简要介绍一下 ES6 的修饰器。修饰器的用法有点类似 Java 中的注解，写在类或者方法的前面 `@decorator` 。
在 JavaSrcipt 中修饰器是一个函数，用来修改类的行为。简单来讲就是一个高阶的类，接受一个类作为参数，经过加工或增强以后返回一个新的类。
基本上，就是下面这个样子的。

```javascript
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

修饰器可以作用在类上，也可以作用在方法上。作用在类上时，被修饰的类作为第一参数传给修饰器方法。

```javascript
function testable(target) {
  target.testable = true;
}

@testable
class Foo {
  constructor(props) {
    this.props = props;
  }
}

console.log(Foo.testable); // true

// 由于修饰器还是 ES7 的一项提案，所以上面的代码在浏览器环境是无法运行的，使用 babel 编译后如下
"use strict";

var _class;

function _classCallCheck(instance, Constructor) {             // |----------------
  if (!(instance instanceof Constructor)) {                   // |
    throw new TypeError("Cannot call a class as a function"); // | babel 封装的检查方法
  }                                                           // |
}                                                             // |----------------

function testable(target) {                                   // |----------------
  target.testable = true;                                     // | 修饰器函数
}                                                             // |----------------

var Foo = testable(                                           // | 调用修饰器函数包装 class Foo
                                                              // |-|----------------
  _class = function Foo(props) {                              // |-| class 转换成 function 声明形式
  _classCallCheck(this, Foo);                                 // |-|----------------
                                                              // |-|----------------
  this.props = props;                                         // |-|-| 原 class Foo 的内部代码
}) || _class;                                                 // |-|---------------

console.log(Foo.testable); // true
```

作用在方法时，修饰器可以接受三个参数，第一个参数是所要修饰的目标对象，第二个参数是所要修饰的属性名，第三个参数是该属性的描述对象。
例如，下面的 `@log` 修饰器，可以起到输出日志的作用 (详见，扩展阅读[2]) 。

```javascript
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling "${name}" with`, arguments);
    return oldValue.apply(null, arguments);
  };

  return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```

MobX 官方推荐修饰器的用法，对要观察的类，直接添加 `@observer` 即可，对 store 内被观察的属性，直接添加 `@observable` 即可。
方便快捷，还低入侵性。当然为了使用修饰器，我们的配置也需要做些许调整。首选需要额外引入 babel 的一个插件， 
`babel-plugin-transform-decorators-legacy` 用来转码， `npm install` 后在 [.babelrc](./.babelrc) 内添加 
`"plugins": ["transform-decorators-legacy"]` 的配置。其次需要添加 [tsconfig.json](./tsconfig.json) 来使得 IDE 能够
支持修饰器的使用。

## 常用 API 介绍

1. `@observable`

`@observable` 用来创建可被观察的对象，通常用在实例字段上。该字段可以是 JS 的基本数据类型也可以是复杂的对象 (包括普通对象、类实例和数组等) 。
当被观察的值是对象时， MobX 实际上会克隆该对象，并把其所有属性都转化成可观察的。这里值得注意的是**对象上只有初始化时便存在的属性会转换成可观察的**，
换言之，动态添加的属性是不会被观察的。(考虑到 JS 的弱语言性质，动态添加的属性依旧可以在 view 层进行引用，虽然对其的修改不会被观察到，但是当组件
在其原因下重新 `render` 时，所做的修改依旧可以体现在 view 层面。这有点类似 React 中直接对 state 进行赋值的 ***反模式*** )。

```javascript
class Store {
  @@observable obj = { a: 1};
}

const store = new Store();

@observer class App extends React.Component {
  render() {
    return (<div>
        <h1>{this.props.store.obj.a}</h1>
        <h1>{this.props.store.obj.b}</h1>
      </div>);
  }
}

store.obj.a = 2; // change 被观察 App 响应重新渲染
store.obj.b = 3; // change 不被观察 App 不响应
// 使用 API extendObservable 添加属性并转换成可观察的
extendObservable(store, { obj: { a: 2, b: 3} });
store.obj.a = 4; // change 被观察 App 响应重新渲染
store.obj.b = 5; // change 被观察 App 响应重新渲染
```

2. `@computed`

`@computed` 用来创建计算值，可以与 excel 表格中的公式类比。例如如下的 excel 表格，在 C1 内输入 `=A1+B1` 将显示为 3 同时每次当 A1 或者 B1 
改变后，C1 均会根据 A1 和 B1 的新值重新计算。在 MobX 中， A1 或 B1 即可为上面的被观察对象，而 C1 以一个纯函数的形式，每次根据 A1 和 
B1 的值重新计算。

||ColA|ColB|ColC|
|:-|-:|-:|-:|
|Row1|1|2|=A1+B1|

`@computed` 需要引用被观察的对象，这样其才能是响应式的(即对应的 `@observable` 对象的改变，会引起引用 `@computed` 值的组件的重新渲染)。 
MobX 对计算值做了很好的优化，如果前一个计算中使用的数据没有更改，计算属性将不会重新运行，如果计算值未被使用，也不会重新运行。 
`@computed` 直接注解在 `setter` 上即可。

```javascript
import { observable, computed } from "mobx";

class OrderLine {
    @observable price = 0;
    @observable amount = 1;

    @computed get total() {
        return this.price * this.amount;
    }
}
```

3. `@observer`

之前我们一直提到响应式，前面的 `@computed` 可以创建一个响应式的熟悉，而这里的 `@observer` 则是用来将 React 组件转变成响应式组件。 
`observer` 并不包含在 MobX 的官方库内(最开始提到了 MobX 跟 React 并无强关联)，而是由 `mobx-react` 库提供。 `@observer` 的用法
也很简单，直接注解在组件上即可，需要注意的是，如果使用高阶组件或者要组合其他修饰器时， `@observer` 要写在最深处。
对于写成函数形式的无状态组件(stateless functional component)，也可以使用 `observer` 方法来包装。

```javascript
import { observer } from 'mobx-react';

// ES6 用法
// 如果有其他高阶组件或者修饰器需要写在 @observer 之前
@someHOC
@someDecorator
@observer
class Hello1 extends React.Component {
  render() {
    return <h1>hello, {this.props.store.name}</h1>;
  }
}

// ES5 用法
const Hello2 = observer(({ store }) => <h1>hello, {store.name}</h1>);
```

4. `@action`

`@action` 接收一个函数并返回具有同样签名的函数，当使用严格模式时所有 `observable` 对象的修改必须在 `action` 内部执行，否则 MobX 
将抛出异常。可能初看上去 `@action` 没什么大的作用，但是 `action` 提供的另外一个 API 却是很使用的，即 `@action.bound` 它可以自动
为方法绑定正确的 `this` 保证在异步或者组件内部调用时工作正常。同时 `action` 可以和 `transaction` 合并使用，在一组 `action` 完成
后通知计算和反应，从而减少不必要的渲染以及优化性能，在个功能会在进阶使用中做简单介绍。

```javascript
class Ticker {
    @observable this.tick = 0;

    @action.bound
    increment() {
        this.tick++; // 'this' 永远都是正确的
    }
}

const ticker = new Ticker();
setInterval(ticker.increment, 1000);
```

## 代码解析

介绍完常用 API 后，我们来看一下使用 MobX 改写的 Todo List v2.0 又会是怎样的。

首选还是配置环境，我们引入了 `mobx` 和 `mobx-react` 相关的库用于开发。同时我们引入了 `babel-plugin-transform-decorators-legacy` 
库使得 babel 的编译器能正常编译修饰器，并在 `.babelrc` 内补充了相关配置。

```json
// .babelrc
{
  "presets": [
    "es2015",
    "react",
    "stage-0"
  ],
  "plugins": [
    "transform-decorators-legacy"
  ]
}
```

接着我们新增了 `tsconfig.json` 文件，使得 VSCode 支持修饰器的使用(主要是新增 `experimentalDecorators` 的配置)。

```json
// tsconfig.json
{
  "include": [
    "src/**/*"
  ],
  "compilerOptions": {
    "experimentalDecorators": true,
    "allowJs": true
  }
}
```

相较于 lesson107 中的内容，我们去掉了 dispatcher 的结构，同时将 action 也放置在了 store 内部，于是文件夹的层级结构就仅剩下了 
components 、 constants 和 stores 。

```bash
.
├── res
│   └── style
├── src
│   ├── components
│   ├── constants
│   ├── stores
│   └── index.jsx
├── .babelrc
├── .eslintrc
├── index.html
├── package.json
├── tsconfig.json
└── webpack.config.js
```

由于在 Flux 章节中，我们已经将组件内部的业务逻辑抽离，所以 components 内的内容基本上可以完全复用，我们需要做的就是改写 store 和将 
store 注入组件，以及将组件转化成响应式组件。

1. 改写 store

回顾 Flux 章节中的 store 主要用来管理和存储数据，对 action 的相应则是通过对在 dispatcher 上注册的回调。而 MobX 中的 store 则更像
一个传统意义上的领域模型，既保存了业务中需要使用的数据，也包含对数据进行修改的方法。

```javascript
// ./src/stores/TodoStore.js
import { observable, action, useStrict } from 'mobx';

// 启用严格模式
useStrict(true);

// 构建 Store 类
class Store {
  @observable todos = todos;

  /* ... */

  @action
  logout() {
    this.doer = null;
    this.errMsg = null;
  }

  /* ... */

  @action.bound
  deleteTodo(tid) {
    this.todos = this.todos.filter(x => x.tid !== tid);
  }
}

// 导出 store 实例
export default new Store();
```

在上面的 `class Store` 内，我们首选定义了需要被观察的对象，接着便是定义业务相关的 action 。可以看到对 `logout` 方法我们并没有使用 
`.bound` 绑定 `this` ，而对 `deleteTodo` 方法我们主动绑定了 `this` 这主要跟两个方法的使用环境有关。`logout` 方法的调用在 `DoerInfo` 
组件的 `handleLogout` 方法内，该组件作为**容器组件**直接接触 `store` ，虽然写在 `setState` 的回调内，但因为使用了箭头函数因此可以正确的获得 `this` 。反观 `deleteTodo` 方法的调用在 `TodoView` 内部，其作为**展示组件**，是无需知道 `store` 存在的，所以需要为方法指明 `this` 。

```javascript
// ./src/components/DoerInfo.jsx
handleLogout(e) {
  e.preventDefault();
  this.setState({ name: '', pswd: '' }, () => {
    this.props.store.logout();
  });
  // 不用箭头函数又需要正确绑定 this 这时要拿到的 this 实际上是注入的 store
  // this.setState({ name: '', pswd: '' }, this.props.store.logout.bind(this.props.store));
}

// ./src/components/TodoView.jsx
export default function TodoView({ todo, markTodo, deleteTodo }) {
  /* ... */
  return (
    <div className="todo-view">
      {/* ... */}
      <span><button
        // view 层的交互直接触发出入的 store 内的 action
        onClick={() => { deleteTodo(tid); }}
      >x</button></span>
    </div>
  );
}
```

2. 注入 store

在 Flux 的章节，`store` 的注入，都是通过 `import` 注入组件，然后使用 `store` 暴露的方法获得数据。在 MobX 中 `store` 作为 `props` 
传递给组件，组件同时获得 `store` 的所有属性和方法。

```javascript
// ./src/components/TodoApp.jsx
import store from '../stores/TodoStore';

export default function () {
  return (
    <div>
      <h1>Todo List</h1>
      <DoerInfo store={store} />
      <AddTodo store={store} />
      <hr />
      <TodoList store={store} />
    </div>
  );
}
```

3. 转化组件

这个过程很简单，在需要渲染 `observable` 数据的 `class` 组件前加上 `@observer` 或对无状态组件使用 `observer` 方法。

```javascript
// ./src/components/DoerInfo.jsx
import { observer } from 'mobx-react';
@observer
export default class DoerInfo extends React.Component {
  /* ... */
}

// ./src/components/TodoList.jsx
function TodoList({ store }) {
  /* ... */
}
export default observer(TodoList);
```

好了，现在我们 `npm install` 然后 `npm run start` 等待编译完成后浏览器将自动打开，即可看到我们用 MobX 改写的 Todo List v2.0 。
相较之前 Flux 版的 Todo List v2.0 ，这个版本 App 的代码得到了一定的简化(去掉了组件内部事件监听和解绑的部分，省略了 dispatch 的过程)，
同时也保证了清晰的业务和展示功能的分离。

## MobX 进阶使用

MobX 除了上面介绍的 API 还有大量实用工具和内部函数用来解决遇到的问题或者优化代码，这里简要介绍 
`inject` 、 `autorun` 、 `runInAction` 和 `transaction` 四个，当然套用官方的话，掌握了上面常用 API 中的四个就够了。

> 理解了 `observable` 、 `computed` 、 `reactions` 和 `actions` 的话，说明对于 Mobx 已经足够精通了。

1. `inject`

回看我们在 `TodoApp` 中的代码，我们不难发现所有的**容器组件**，都是通过 `<Component store={store} />` 的形式注入的 `store` 。
如果我们要在多处引用同一个组件，就需要多次的注入 `store` 很不方便。鉴于此， MobX 提供了另外一种 `store` 的注入方法，即通过 `Provider` 的
形式注入。我们在 App 的最外层包裹 `Provider` ，然后把需要注入的 `store` 传递给 `Provider` ，这样就可以通过 `inject` 的形式可借由 
React 的 `context` 机制，把任意的 `props` 注入到组件内部。

```javascript
// ./src/advanced/01inject.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer, inject, Provider } from 'mobx-react';

class Store {
  @observable name = 'Rainsho';
}

const store = new Store();

// 非严格模式下将 store 暴露在 window 下
// 加载完页面后可直接在浏览器的 Console 下赋值 store.name = 'Hulk';
window.store = store;

// inject 的第一种使用方式入参为 string
// 相当于将 Provider 的 props.store 作为要注入组件的 props.store 传入
@inject('store')
@observer
class Hello1 extends React.Component {
  render() {
    return <h1>hello, {this.props.store.name}</h1>;
  }
}

// inject 的第二种使用方式入参为 function
// function 的入参为 Provider 的所有 props
// function 返回的对象作为 props 传入给需要注入的组件
@inject(stores => ({
  name: stores.store.name,
}))
@observer
class Hello2 extends React.Component {
  render() {
    return <h1>hello, {this.props.name}</h1>;
  }
}

// 注意 Provider 只接受一个唯一的 child
// 如果有多个 children 则需要在外层再做一次包裹
ReactDOM.render(
  <Provider store={store}>
    <div>
      <Hello1 />
      <Hello2 />
    </div>
  </Provider>,
  document.getElementById('root'),
);
```

使用 `npm run adv01` 启动 demo ，在浏览器 Console 内输入 `store.name = 'Hulk';` 即可看到页面变化。

2. `autorun`

`autorun` 用来创建一个响应式函数，与 `computed` 的区别在于，他不需要有观察者，因此可以用来打印日志或者更新 UI 等。
`autorun` 接受一个方法作为参数，同时返回一个 `disposer` 方法用来销毁。

```javascript
var numbers = observable([1,2,3]);
var sum = computed(() => numbers.reduce((a, b) => a + b, 0));

var disposer = autorun(() => console.log(sum.get())); // 输出 6
numbers.push(4); // 输出 10

disposer(); // 清理当前 autorun
numbers.push(5); // 不会再输出任何值 sum 也不会再重新计算
```

为了更好的对比其与 `computed` 的区别，可以参照 [02autorun.jsx](./src/advanced/02autorun.jsx) 内的代码。
我们使用 `npm run adv02` 启动 demo ，打开浏览器 Console 。

```javascript
// ./src/advanced/02autorun.jsx
// 全局变量用来计数
let count = 0; 
class Store {
  @observable numbers = [1, 2, 3];
  @observable showSum = true;
  @computed get sum() {
    count++;
    return this.numbers.reduce((a, b) => a + b, 0);
  }
}
const store = new Store();
// 将 store 暴露在 window 下
window.store = store;
// 创建 autorun 并将 disposer 方法暴露在 window 下
window.disposer = autorun(() => console.log(`numbers is ${store.numbers} count is ${count}`));

/**** 以下为浏览器 Console 内的操作 ****/

// 页面渲染 1 2 3 sum is 6
// Console 内 autorun 的第一次输出 'numbers is 1,2,3 count is 0'
// ps: 此时的 count 实际为 1 因为 render 中有调用 sum 的 get 方法

store.numbers.push(4);
// 页面渲染 1 2 3 4 sum is 10
// Console 输出 'numbers is 1,2,3,4 count is 1'
// ps: 此时的 count 实际为 2 因为 reRender 时再次调用 sum 的 get 方法

store.showSum = false;
// 页面渲染 1 2 3 4

store.numbers.push(5);
// 页面渲染 1 2 3 4 5
// Console 输出 'numbers is 1,2,3,4,5 count is 2'
// ps: 此时的 count 为 2 因为 sum 不再被引用 mobx 不再对其进行重新计算

store.numbers.push(6);
// 页面渲染 1 2 3 4 5 6
// Console 输出 'numbers is 1,2,3,4,5,6 count is 2'

disposer();
store.numbers.push(7);
// 页面渲染 1 2 3 4 5 6 7
```

3. `runInAction`

前面讲的 `action` 用来注解一个会修改 `observable` 对象的方法。但是 `action` 修饰器的作用范围只包含当前运行的函数，换言之被丢进
事件循环的部分，并不在 `action` 的影响范围内。比如你在方法内使用了定时器、 promise 的 `then` 或 `async` 语句，并且尝试在回调函数
中修改某些状态，这部分回调代码也是需要包裹在 `action` 内的，否则在严格模式下就将抛出错误。

```javascript
mobx.useStrict(true); // 不允许在动作之外进行状态修改

class Store {
  @observable state = 'waiting';

  @action.bound
  asyncAction1() {
    this.state = 'pending';
    fetchData()
      .then(() => {
        this.state = 'done';
      })
      .catch(() => {
        this.state = 'error';
      });
  }
}
```

例如上面的示例将会抛出异常，因为 `fetchData` 的 promise 的回调函数并不是 `asyncAction1` 动作的一部分， `action` 只会作用于当前栈。
(关于事件循环和调用栈的问题，可以参看扩展阅读[4]) 。

针对上面的问题，最简单的修复就是将 promise 的回调也包装成 `action` 。

```javascript
@action.bound
handleDone() {
  this.state = 'done';
}

@action.bound
handleError() {
  this.state = 'error';
}

@action.bound
asyncAction2() {
  fetchData()
    .then(this.handleDone)
    .catch(this.handleError);
}
```

这样写也还算比较清楚，但当异步流程复杂后可能会略显啰嗦。另外一种修改方式就是使用 `runInAction` 工具函数，这样可以避免到处写 `action` ，
而是仅在需要修改 `observable` 时进行修改。 `runInAction` 接受一个方法作为入参，事实上 `runInAction(f)` 可以看成 
`action(f)()` 的语法糖。

```javascript
@action.bound
asyncAction3() {
  fetchData()
    .then(() => {
      // do something
      runInAction(() => {
        this.state = 'done';
      });
    })
    .catch(() => {
      // do something
      runInAction(() => {
        this.state = 'error';
      });
    });
}
```

4. `transaction`

最后聊一聊 `transaction` ，这是个比较底层的 API ，在绝大多数场景下使用 `action` 或 `runInAction` 即可。 `transaction` 的
主要作用是其可以嵌套包裹多个方法，且仅在最外层 `transaction` 执行完后才会通知观察者做出相应。值得一提的(~~我之前不知道的~~)是 
`action` 会自动将方法包裹在 `transaction` 里面，所以这个示例 demo 就不使用严格模式了。另外，由于 React 的自身也会维护一组
事务(用来合并当前调用栈内的 `setState` )，所以要看到 `transaction` 的作用，我们还需要将 `store` 内的方法也写进 React 代理事件
的回调内。

```javascript
class Store {
  @observable count = 0;

  // 不使用 action 注解的修改 observable 对象的方法
  withoutTransaction() {
    this.count++;
    this.count++;
    this.count++;
  }

  // 使用 transaction 包裹修改 observable 对象的方法
  withTransaction() {
    transaction(() => {
      transaction(() => {
        this.count++;
        this.count++;
      });
      this.count++;
    })
  }
}

/* ... */

render() {
  console.log('render', ++this.times, 'times');
  return (
    <div>
      <h1>{`count is ${this.store.count}`}</h1>
      <button onClick={() => {
        new Promise(res => res())
          .then(() => this.store.withoutTransaction());  // 在回调内执行 store 内的方法
      }}>withoutTransaction</button>
      <br />
      <button onClick={() => {
        new Promise(res => res())
          .then(() => this.store.withTransaction());    // 在回调内执行 store 内的方法
      }}>withTransaction</button>
    </div>
  );
}
```

使用 `npm run adv04` 启动 demo ，打开浏览器 Console ，当点击 withoutTransaction 按钮时，我们可以看到每次修改 `observable` 对象 
MobX 都会去通知组件进行渲染，因此组件将 `render` 三次。而点击 withTransaction 按钮时，我们可以看到 MobX 会等三次修改都完成后才去通知
组件进行渲染，因此组件只 `rendre` 了一次。

## 小结

到此 MobX 的内容就算简单介绍完了。对比于 Redux ，个人感觉 MobX 更偏重面向对象的思想，其 store 就是既包含数据模型，也包含业务功能的领域模型。
而 Redux 则更偏重于函数式编程，通过纯函数去修改 state 。当面对一个不太复杂的项目时， MobX 的引入成本不大，核心 API 也较少，也没有过于复杂的
抽象概念。在引入后基本上无须额外维护 state ，也可以很容易的将业务逻辑抽离到 store 内部，让组件只需关心 view 层的展示，最大程度的发货 React 
的优势。

## 扩展阅读

1. [MobX 中文文档](http://cn.mobx.js.org/)
1. [阮一峰: ES6入门#方法的修饰](http://es6.ruanyifeng.com/#docs/decorator#方法的修饰)
1. [JavaScript 中的"纯函数"](http://web.jobbole.com/86136/)
1. [JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

下一章: [Redux](../lesson109/README.md)
