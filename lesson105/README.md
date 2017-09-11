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

5. 设定 webpack 的配置文件 webpack.config.js :

```javascript
var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loaders: 'eslint-loader',
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: 9000,
    contentBase: './src',
  }
}
```

## 生产环境的一些优化

## Todo List 的功能扩展

## 扩展阅读
