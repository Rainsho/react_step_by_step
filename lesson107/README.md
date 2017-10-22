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

2. Dispatcher

3. Store

4. View

## 代码解析

## 扩展阅读

1. [Flux 官方网站](https://facebook.github.io/flux/)

下一章: [MobX](../lesson108/README.md)
