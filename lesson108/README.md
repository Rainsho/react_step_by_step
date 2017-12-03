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

## 扩展阅读

1. [MobX 中文文档](http://cn.mobx.js.org/)
1. [阮一峰: ES6入门#方法的修饰](http://es6.ruanyifeng.com/#docs/decorator#方法的修饰)
1. [JavaScript 中的"纯函数"](http://web.jobbole.com/86136/)

下一章: [Redux](../lesson109/README.md)
