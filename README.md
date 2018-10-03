# React Step by Step

> 工作调整，目前真是融入期，`master` 分支可能没时间更新文档，会新开 `learn` 分支写代码。 ——2018 年 5 月 6 日 14 点

今年开始接触前端，准确的来说是现代前端技术。看的东西越来越多，打算利用这个项目做个总结及回顾。首选这个项目的定位是一个 React 的入坑教程，计划从前端渲染的 Hello World 级的 demo 开始，最后一步步实现一个以 Node.js 作为后台的多人共享的开放的 Todo List 应用，计划涉及的内容包括但不限于: React ES6 Node.js Babel Flux Redux MobX webpack ESLint glup Ant-Design。

前面几章将主要围绕前端开发环境的搭建，我们将从“零”开始，一步步搭建一个完善的前端开发环境。后面将开始讨论一些使用 React 的过程中可能遇到的问题。

## 预备知识

本项目偏重实战，故假设你对 React 已经有了基本的认识，如果没有，以下三篇文章个人认为是快速入门里面的佼佼者:

1.  [菜鸟教程: React 教程](http://www.runoob.com/react/react-tutorial.html) 内容简练，可以快速的对 React 有个基本认识；
2.  [阮一峰: React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html) 阮大神的实例教程，所有 [demo](https://github.com/ruanyf/react-demos) 亦在 GitHub 开源；
3.  [Facebook: React Docs](https://facebook.github.io/react/docs/hello-world.html) 官方的 Docs 个人认为是最好的资料，可惜是英文版的，若果觉得不爽可以参考这个哥们的笔记，基本上是官方文档的翻译版 [Gallery: React 学习笔记](https://blog.gmem.cc/react-study-note)

## 项目目录

- [x] [lesson101](./lesson101) Hello World (Simple Todo List)
- [x] [lesson102](./lesson102) Node.js 及 npm 简单介绍
- [x] [lesson103](./lesson103) Babel 及 webpack 打包
- [x] [lesson104](./lesson104) ESLint 语法检查
- [x] [lesson105](./lesson105) 完整的开发环境
- [x] [lesson106](./lesson106) Todo List v2.0
- [x] [lesson107](./lesson107) Flux
- [x] [lesson108](./lesson108) MobX
- [x] [lesson109](./lesson109) Redux
- [ ] [lesson110](./lesson110) 整合 Router & Intl
- [ ] [eto_spider](https://github.com/Rainsho/eto_spider) Ant-Design
- [ ] [eto_spider](https://github.com/Rainsho/eto_spider) Node.js 后台
- [ ] [xdemo101](https://github.com/Rainsho/react_step_by_step/tree/learn/xdemo101) dva demo
- [ ] [xdemo102](https://github.com/Rainsho/react_step_by_step/tree/learn/xdemo102) rx demo
- [ ] [xdemo103](https://github.com/Rainsho/react_step_by_step/tree/learn/xdemo103) jest demo
- [ ] [xdemo104](https://github.com/Rainsho/react_step_by_step/tree/learn/xdemo104) redux-saga demo
- [ ] [xdemo105](https://github.com/Rainsho/react_step_by_step/tree/learn/xdemo105) react(v16 new API) demo

## 环境版本

这个项目启动的时候 React 的最新版本为 v15.6.1 故本项目中在没有特别约定的情况下均使用此版本。

node 和 npm 的版本如下:

```bash
$ node -v
v7.8.0
$ npm -v
v4.2.0
```
