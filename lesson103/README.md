# Babel 及 webpack 打包

到这里的话，我们已经准备好了 Node.js + npm + VSCode 可以说前端开发环境已经初见端倪了。但显然需要自己去引入
依赖库并且在前端进行转码是不现代的方法。在这一章里，我们将简单介绍一下 Babel 和 webpack 这两个工具的使用。并
继续完善我们的前端开发环境。

后面的章节如无意外的话，请第一时间在当前目录下执行 `npm install` 安装所需依赖，以保证示例能够正确执行。

## Babel

Babel 实际上在 lesson 101 中就已经使用了，只不过当时是以第三库的形式引入进了页面，主要工作也就是将 JSX 语法
转换成浏览器可以执行的 JS 语法。这个工作在现代前端开发中一般会在开发环境下完成，直接将转换好的代码交给前台执行。
因此， Babel 最佳的执行环境其实是 Node.js 的环境，用法也很简单。直接安装 babel-cli 然后在命令行执行就可以了。
一般的教程都会建议你直接通过 `npm install -g babel-cli` 将 babel-cli 安装成全局的，然后直接在命令行输入 
babel 进行转码，但是对于我这种有洁癖的程序猿来讲，全局污染是一件不能忍的事情，所以这里只会将 babel-cli 安装在
当前目录下，然后通过 package.json 内的 `script` 执行。

```bash
# 首选安装 babel-cli
$ npm install --save-dev babel-cli
# 尝试将 babel_es6.js 内 ES6 写法的箭头函数转换成 ES5 的写法
# 下面的 script 实际上执行的是 babel babel_es6.js -o ./dist/es5.js
$ npm run es6
# 尝试将 babel_es6.js 内 ES6 写法的箭头函数转换成 ES5 的写法
# 下面的 script 实际上执行的是 babel babel_jsx.jsx -o ./dist/jsx.js
$ npm run jsx
```

`npm run es6` 执行后你会发现在 dist 文件夹确实新生成了 es5.js 但是代码没有任何变化，`npm run jsx` 执行后你会
发现干脆直接报错了。这是因为我们没有对 babel 进行配置，想要 babel 能够正确的编译代码需要对其进行配置，一般通过插件 
(plugin) 或预设 (preset) 进行配置，接下来我们安装两个相关预设。

```bash
# babel-preset-es2015 负责将 ES6 语法编译成 ES5 语法
# babel-preset-react 负责转换 JSX 语法
$ npm install --save-dev babel-preset-es2015 babel-preset-react
```

使用插件或者预设有两种方式，命令行或配置文件，命令行的话可以参考将如下命令加入 `script` ，当然如果你把 babel-cli 
安装成全局的话，也可以直接执行下面两条命令。使用配置文件的话只需在当前目录下新建 .babelrc 文件即可。

```bash
$ babel babel_es6.js -o ./dist/es5.js --presets=es2015
$ babel babel_jsx.jsx -o ./dist/jsx.js --presets=es2015,react
```

配置文件是一个 json 格式的文件，大概长这样:

```json
{
    "presets": [
        "es2015",
        "react"
    ],
    "plugins": []
}
```

配置文件还是比较友好的，我们在 `presets` 字段内指定要使用的预设，在 `plugins` 字段内指定要使用插件即可。在有配置文件的
情况下，会优选使用配置文件内的规则。所以如果你配置了配置文件，上面的两条 `script` 就不会报错了，因此这里暂时将其注释掉。
将其取消注释再执行 `npm run es6` 或者 `npm run jsx` 就可以在 dist 文件夹内看到预期的编译后的 js 代码了。

## webpack

## 扩展阅读

1. [babel-cli docs](https://babeljs.io/docs/usage/cli/)
