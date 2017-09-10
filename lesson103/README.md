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

# 非全局安装下，也可以通过 node 执行对应的文件
$ node ./node_modules/babel-cli/bin/babel babel_es6.js -o ./dist/es5.js --presets=es2015
$ node ./node_modules/babel-cli/bin/babel babel_jsx.jsx -o ./dist/jsx.js --presets=es2015,react
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

补充一句，这里使用的 webpack 指 webpack 2.x 即 webpack2 。

webpack 最简单的作用就是打包，顾名思义就是将各个相互依赖的文件打包统一到一个或多个文件中。这里说的依赖既可以是 AMD 也可以
是 CommonJS (Node.js 使用) 或者 ES6 的模块，简言之就是从一个或多个入口开始，将所有的通过 `require` 或 `import` 引入
的文件打包到一起。 webpack 借助其强大的 loader / plugin 机制，也在一定程度上可以替代传统的任务流工具，通过简单的配置或者
插件引入即可以实现从静态检查、文件转码、文件合并、压缩等一系列工作，甚至也可以充当测试服务器的角色。

```bash
# 首选安装 webpack
# 由于 webpack 比较常用，通常建议安装在全局，在下面的代码后面加 -g 即可
# 后面用到 webpack 的地方，如果是全局安装就可以直接使用 webpack
# 非全局安装可以通过 node ./node_modules/webpack/bin/webpack.js 使用
$ npm install --save-dev webpack
```

先看个简单的例子，假设我们有 index1.js 和 index2.js 两个 js 文件 (模块) ，其中 index1.js 在 `1-2` 处通过 `require` 
引入了模块 index2 。这个时候我们就可以通过 webpack 把 index1 和 index2 打包到一起。执行 `npm run webpack` 或者等价
的 `webpack index1.js ./dist/index.js` 。

```javascript
// index1.js
console.log('this is in index1.js');    // 1-1
var str = require('./index2.js');       // 1-2
console.log(`hello, ${str}`);           // 1-3

// index2.js
console.log('this is in index2.js');    // 2-1
var str = 'world';                      // 2-2
module.exports = str;                   // 2-3
```

由于上面的代码是使用 CommonJS 的规范写的，实际上是可以直接在 Node.js 环境下执行的 (你可以试试直接输入 `node index1`) 。
但是显然是不能在浏览器环境下执行的，但是通过 webpack 打包后的 index.js 文件却是可以直接在浏览器运行的 (有兴趣的伙伴可以
直接将 index.js 里面的代码粘贴到浏览器 console 里面，不出意外的话应该是可以看到 hello, world 的输出的) 。至于 webpack 
到底做了什么，这个就不展开了，有兴趣的伙伴可以看扩展阅读里面的第二条。

上面只是为了说明 webpack 的作用，其更常见的用法也是通过配置文件来进行配置的。执行 `webpack` 时如果不给定任何参数 webpack 
默认会在当前路径下寻找 `webpack.config.js` 作为配置文件的。下面还是通过改写 lesson 101 中的例子，来简单介绍一下配置文件
的用法。因为有 webpack 负责转码和打包，我们大可将原来写在页面内的代码抽离写在一个单独的模块中，这样也更加方便功能的扩展和分
模块进行开发。

为了便于组织，我们把所有组件 (其实就一个) 拆分放入 src 文件夹中，这样我们就有了 [TodoList 组件](./src/TodoList.jsx) 。
接下来我们新建 [index.jsx](./src/index.jsx) 文件，用来作为全局的入口，并负责将根组件挂载进真实 DOM 节点。因为代码都
比较简单，这里就不展开讲代码了，我们的重点是 webpack 的配置。

首选安装，我们将要用到的库:

```bash
# react 相关
$ npm install --save react react-dom
# webpack 使用的 loader
$ npm install --save-dev babel-loader
```

如果你第一次看到 `--save` 和 `--save-dev` 一定会有疑问，这两个选项有什么区别，关于这个问题的讨论有很多，个人认为最可区分
的不同就是，在 `npm install --production` 时或者注明 `NODE_ENV` 变量为 `production` 时，只会下载 package.json 
中 `dependencies` 的模块，而不会下载 `devDependencies` 的模块。

这里我们还安装了 babel-loader 用来在 webpack 打包时执行转码的操作。 loader 之于 webpack 就像前面的 preset 之于 
babel 一样，都可以看做对原有功能的扩展。不过 loader 更官方的定义如下:

> functions (running in node.js) that take the source of a resource file as the parameter and return 
the new source

我们这里使用 babel-loader 就是在打包的时候将代码首选使用 babel 进行转码。

接下来我们看下 [webpack.config.js](./webpack.config.js) 的具体配置。可以看到 webpack.config.js 其实就是一个符合 
CommonJS 规范的输出模块，其中的必填项其实就是上面那个简单例子中的两个参数，即: 入口 entry ('index1.js') 和出口 
output.filename ('./dist/index.js') 。 webpack 会递归的检测从入口开始的所有依赖的模块，然后进行打包。其他的配置结合
下面的示例进行简单解释，更多的配置规则和用法，请参考扩展阅读第三条。

```javascript
// webpack.config.js
module.exports = {                          // CommonJS 标准的输出模块
  entry: './src/index.jsx',                 // 入口 (必须项) string | object | array
  output: {                                 // 出口 除了 filename 还有 path 等可配置
    filename: './dist/bundle.js',           // 出口文件名 (必须项)
  },
  module: {                                 // 模块配置
    loaders: [                              // 模块的规则的配置 2.x 建议使用 rules 代替 loaders
      {
        test: /\.jsx?$/,                    // 匹配规则 regExp | string
        loader: 'babel-loader',             // 需要使用的 loader
        options: {                          // loader 的配置
          presets: ['es2015', 'react'],     // !由于我们把 .babelrc 里的配置注释掉了
        }                                   // !所以此处需要指定 否则可省略
      }
    ]
  },
  resolve: {                                // 查找 module 相关配置
    extensions: ['.js', '.jsx'],            // 扩展文件后缀名 指定可省略的后缀
  }                                         // import './App.jsx' -> import './App'
}
```

配置好 webpack.config.json 后，我们直接在当前目录下输入 `webpack` 或者执行脚本 `npm run build` 即可执行打包任务，
不出意外的话等待几秒钟就可以在 ./dist 文件夹看到打包后的 bundle.js 文件了。这个文件现在既包含了我们引入的 react 和 
react-dom 模块，也包含了我们写的 TodoList 组件，因此，在 index.html 里面，我们只需要引入 
`<script src="./dist/bundle.js"></script>` 这一个文件就可以了。打开 index.html 此时 lesson 101 里面熟悉的画面
又回来了。

![hello_world](../lesson101/pic/hello_world.png)

当然 webpack 的功能远不仅如此，在打包之前我们可以执行静态检查，在打包之后我们执行进行压缩、混淆等任务，在此就不展开了。
到目前为止，我们的 demo 都是通过本地文件的形式打开的，显然是很 low 的一种处理方式。所以接下来，我们通过两个插件体会一下 
webpack 更多的功能。

```bash
# 首选安装插件
# 其中 webpack-dev-server 允许我们启动一个 Express server 为 bundle 服务
# 而 open-browser-webpack-plugin 顾名思义就是帮我们打开浏览器
$ npm install --save-dev webpack-dev-server open-browser-webpack-plugin
```

关于这两个插件的配置，我放在了 webpack.dev.js 里面，配置好了以后可以通过脚本 `npm run dev` 启动即可。这时候 webpack 
会在打包编译完成以后为我们打开浏览器，并定位到本地的 9000 端口下，没有意外的话我们的 demo 就会正确的出现在浏览器中。同时
这个时候 webpack 处在实时编译状态，任何对组件的修改都会同步编译并刷新到页面中。

```javascript
// webpack.dev.js
module.exports = {
  /* ... */
  devServer: { }, // webpace-dev-server 相关配置 示例中我们只改了默认的启动端口
  plugins: [ ],   // 插件相关配置 webpack 的插件是可实例化的对象
}
```

## 扩展阅读

1. [babel-cli docs](https://babeljs.io/docs/usage/cli/)
1. [解读 webpack 的 bundle.js](http://www.cnblogs.com/venoral/p/6102976.html)
1. [webpack docs](https://webpack.js.org/configuration/)
1. [webpack-dev-server docs](https://webpack.github.io/docs/webpack-dev-server.html)

下一章: [ESLint 代码检查](../lesson104/README.md)
