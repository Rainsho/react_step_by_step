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

## 扩展阅读

1. [Flux 官方网站](https://facebook.github.io/flux/)

下一章: [MobX](../lesson108/README.md)
