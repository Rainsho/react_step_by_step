# ESLint 语法检查

其实这一章并不是前端开发所必需的内容，但个人觉得却是想写好代码，或者养成一个良好编码习惯 (~~强迫症~~) 的必要环节。
首选 ESLint 是什么？借用官网的话就是:

> ESLint 是一个开源的 JavaScript 代码检查工具，由 Nicholas C. Zakas 于2013年6月创建。代码检查是一种静态的
分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译
程序会内置检查工具。

如果你使用过类似 Java 的强类型编程语言就会发现有很多小的错误在编译阶段即可被 IDE 发现，比如: 不会执行的代码，或者
类型错误等等。但由于 JS 是一门弱类型的语言，很多编码过程中的问题不会第一时间暴露从而在执行过程中造成一些与预期不符的
错误。诸如拿到了 `obj = {state: 1}` 却使用的是 `obj.stata` 属性。当然做静态检查这种事情也有 TypeScript 等可以
使用，ESLint 最吸引本人的可能更多的是他的格式化检查 (你完全可以自定义规则养成自己的编码风格，或按照某内置或第三方
插件的规则规范自己的编码规则) 和它灵活的检查规则配置 (受不了的规则可以统统关闭) 。 ESLint 还有一个好处就是可以通过 
eslint-loader 配合 webpack 通过配置 preLoaders 在打包编译之前先进行静态检查再进行打包编译。当然更多的好处各位
可以移步官网或者自己发掘。

从本章开始，所有的代码都会使用 ESLint 做静态检查，至于 ESLint 的规则配置，其实有众多第三方的插件 (plugin) 支持，
无需我们从“零”开始配置，这里我们使用 Airbnb 公司的规则。有一点需要说明的是，Airbnb 公司的规则默认的缩进是两个空格，
所以如果你是使用的 VSCode 作为开发工具的话，可以在 “用户设置” 里面找到 `"editor.tabSize": 4,` 设置，把其值设置
为2，这样你的 “格式化代码” 功能，就会按2个空格作为缩进进行排版。

## 使用 ESLint

说了这么多废话，让我们看一下如何使用 ESLint 吧。

1. 安装

```bash
# 首选安装 ESLint
$ npm install --save-dev eslint
# 安装要使用的规则 eslint-config-airbnb
$ npm install --save-dev eslint-config-airbnb
# 安装当前规则依赖的插件
$ npm install --save-dev eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
```

2. 配置

ESLint 的配置通过 .eslintrc 的配置文件进行配置，跟 .babelrc 的配置文件类似，都是一个 json 格式的配置文件。配置文件
大概长下面那个样子，可以通过 `extends` 指定需要继承的规则，通过 `rules` 覆盖部分已有的规则或自定义自己的规则。

```json
{
  "extends": "airbnb",
  "rules": {}
}
```

3. 使用



## 扩展阅读

1. [ESLint 中文官网](http://eslint.cn/docs/about/)

下一章: [Todo List v2.0](../lesson105/README.md)
