# MobX

在上一章我们介绍 Flux 的时候提到过， Flux 设计模式并没有简化代码，只是提出了一种易于扩展的架构和分工。这一章，我们就一起学习一下
基于 Flux 模式的一种简化实现 MobX 。老实说，在笔者第一次接触 MobX 的时候觉得其是一个很简单的库，也因此 MobX 的 demo 压根没做功能
划分，就只是单独抽离了一个 store 出来。最近通读了官方文档，才意识到 MobX 远比想象的强大。所以这里的定位就退到 MobX 的快速入门吧，
更多功能和更高级的用法，可能还是需要各位移步官方文档。

## MobX 概念介绍

MobX 的官方定义是***简单、可扩展的状态管理***，和 Redux 类似， MobX 实际上只是一个**状态管理**工具，与 React 并无强关联，也可以
用在任意其他的前端项目中。 MobX 的核心是观察者模式，即 MobX 负责主动的观察 store 内被观察者 (`observable`) 的变化，一旦 store 
有变化，观察者 (`observer`) 即刻差距，从而产生对应的动作(在与 React 共同使用时，即时组件的重新渲染)。

在 React 的项目中，其构建了一种如下的单向数据流模式。用户交互触发 action ， action 导致 store 内的 state 被改变，从而使的组件
重新渲染 view 。

![action-state-view](./pic/action-state-view.png)

store 内的属性有两种，一种是前文提到的被观察属性 (`observable`) ，另一种是基于被观察属性自动计算得到的属性 (`computed`) 。在 lesson106 
里我们提到过 state 的设计原则中有一条是**最小粒度原则**，即任何可以通过计算得到的状态都不应该作为 state 。 MobX 引入 `computed` 可以说
也是这一思想的体现。例如我们可以定义一个 todo 的集合 `todos = observable([todo1, todo2])` ，而当我们需要使用 todo 总数时就可以直接
通过 `computed` 得到 `tatal = computed(() => todos.length)` 。

MobX 通过 mobx-react 与 React 建立联系，组件通过 `observer` 的包装转变成相应式组件，即可以主动感知 `observable` 的变化。

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

## 常用 API 介绍

## 代码解析

## MobX 进阶使用

## 扩展阅读

1. [MobX 中文文档](http://cn.mobx.js.org/)

下一章: [Redux](../lesson109/README.md)
