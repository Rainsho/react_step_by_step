# Todo List v2.0

从这一章开始，我们要正式开始我们的 React 开发之旅了。简单的回顾一下，我们在前面提到了 npm Babel webpack 
ESLint ，现在就让我们用这些工具从“零”搭建一个 React 的前端开发环境吧！

## 搭建开发环境

1. 在根目录生成 npm 的配置文件 package.json :

```bash
$ npm init
```

2. 安装相关依赖

```bash
# React 库
$ npm install --save react react-dom
# 开发环境相关库
$ npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
$ npm install --save-dev eslint eslint-config-airbnb eslint-loader eslint-plugin-import
$ npm install --save-dev eslint-plugin-jsx-a11y eslint-plugin-react webpack webpack-dev-server
# npm install --save-dev css-loader style-loader
```

最后一组是用来打包 css 文件的 loader ，可以在 webpack 进行对应的配置，这样引用的 css 文件将打包到 bundle.js 
文件内。不过现在前端开发一般倾向于将 css 的引用放入 `<head>` 标签内，而将 js 的引用放在 `<body>` 尾部，保证
页面首选加载样式文件避免短暂的无样式页面。考虑到暂时不想写样式 (~~其实不太会做样式~~) 所以先不讨论 css 的打包和
引入的问题吧。另外，三条 `save-dev` 当然是可以合成一条的，只是太长了排版不太好看所以拆成了三条。

安装完依赖后，我们在根目录建立 src 和 res 文件夹，分别用来放置 script 文件和 source 静态资源 (img / css 等)。 
将上一章的代码拷贝过来以后我们的目录结构大致如下: 

```bash
./
├── .babelrc
├── .eslintrc
├── res
│   ├── img
│   └── css
├── src
│   ├── components
│   │   └── TodoList.jsx
│   ├── index.html
│   └── index.jsx
├── README.md
├── package.json
└── webpack.config.js
```

3. 设定 Babel 的配置文件 .babelrc :

```json
{
  "presets": [
    "es2015",
    "react"
  ]
}
```

这里我们使用了两个 Babel 的 preset ， `es2015` 负责将一些 ES6 写法的 JS 代码转换成 ES5 的写法以获得更好的兼容性， 
`react` 则负责将 JSX 语法转换成 `createElement` 方法。

4. 设定 ESLint 的配置文件 .eslintrc :

```json
{
  "extends": "airbnb",
  "rules": {},
  "env": {
    "browser": true
  }
}
```

这里我们使用了 Airbnb 公司的规则，同时设定了运行环境是 `browser` 即浏览器环境，已解决 `document` 未定义的错误提示。

5. 设定 webpack 的配置文件 webpack.config.js :

一些之前没用到的或者比较重要的配置的解释，我写在了注释里面。

```javascript
var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),      // 打包入口
  output: {                                             // 打包出口
    path: path.resolve(__dirname, 'dist'),              // 打包目录
    filename: 'bundle.js',                              // 打包文件名
    publicPath: '/dist/',                               // 发布路径 与 index.html 里的引用一致
  },
  module: {                                             // 模块配置
    rules: [                                            // 模块规则 对应 1.x 版本里面的 loaders
      {
        enforce: 'pre',                                 // 规则标识 pre 表示在打包之前
        test: /\.jsx?$/,                                // 文件名的匹配规则
        loaders: 'eslint-loader',                       // 需要使用的 loader (string | array)
        include: path.resolve(__dirname, 'src'),        // 要包含的文件夹 亦有 exclude 设置
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      }
    ],
  },
  resolve: {                                            // 查找 module 相关配置
    extensions: ['.js', '.jsx'],                        // 扩展文件后缀名 指定可省略的后缀
  },                                                    // import './App.jsx' -> import './App'
  devServer: {                                          // webpack-dev-server 相关的配置
    port: 9000,                                         // webpack-dev-server 运行所在的端口号
    contentBase: './src',                               // 项目的更目录 即 9000 端口访问的路径
  }
}
```

## 生产环境的一些优化

这里不讲代码相关的优化，因为截至目前我们还没开始写真的代码，这里只是提一下在打包生产环境时的一些常用设置。也是介绍两个常用的 
webpack 插件。完整配置参见 [webpack.production.js](./webpack.production.js)

1. 注入环境变量

我们增加 webpack 的 plugins 相关设置，利用 `webpack.DefinePlugin` 向代码运行环境注入 NODE_ENV 的 production 取值，
这样在用第二步相关的代码压缩工具时，一些开发版本中的诸如如下的代码便会被移除。

```javascript
// webpack.prodction.js
new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  }
})

// 常见开发库中代码
if (process.env.NODE_ENV !== 'production') {
  /* ... */
}
```

2. 压缩代码

利用 `webpack.optimize.UglifyJsPlugin` 进行代码压缩，同时去除 `console.log` `debugger` 等这类的代码。

```javascript
// webpack.prodction.js
new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    drop_console: true,
    drop_debugger: true,
  }
})
```

3. 将核心依赖换成压缩版

到目前为止我们项目使用了 `react` 和 `react-dom` 两个库，而在生产环境我们没必要使用完整的开发版的库，一般都使用压缩版的即 
react.min.js 和 react-dom.min.js 两个库。这种替换一般有两种办法，就笔者所在的项目组来讲，是在 webpack 的配置中排除了 
react 和 react-dom 的打包，然后在 index.html 直接引用 .min.js 文件。第二种方法就是这里使用的，在 webpack 中通过指定 
alias 的形式，让 webpack 在打包时使用 .min.js 而不是原本的 index.js 。

```javascript
// webpack.prodction.js
alias: {
  'react': path.resolve(__dirname, 'node_modules/react/dist/react.min.js'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom/dist/react-dom.min.js'),
}
```

经过以上三个简单的步骤，我们执行脚本 `npm run build` 和 `npm run deploy` 分别使用 webpack.config.js 和 
webpack.production.js 进行打包，可以看到，打包后的代码从 765k 被压缩到了 154k (两个数据为改写 Todo List v2.0之前) 。

## Todo List 的功能扩展

## 扩展阅读
