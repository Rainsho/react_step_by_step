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
所以如果你是使用的 VSCode 作为开发工具的话，可以在 “用户设置” 里面找到 `"editor.tabSize": 4` 设置，把其值设置
为 2 ，这样你的 “格式化代码” 功能，就会按 2 个空格作为缩进进行排版。

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

常见的使用方式有以下三种 (已加入 package.json 的 `scripts` 脚本内) :

```json
{
  "scripts": {
    "lint": "eslint index.js",
    "lint-html": "eslint index.js -f html -o ./reports/lint-results.html",
    "lint-fix": "eslint --fix index.js"
  }
}
```

* `lint`: 检查 index.js 文件 (这里也可以使用 \*\* 或 \* 进行通配)
* `lint-html`: 将检查结果写入网页文件 `./reports/lint-results.html`
* `lint-fix`: 自动修正不规范的代码

4. 说明

index.js 内代码如下:

```javascript
var x = 1;
console.log('x is', x);
```

我们执行 `npm run lint` 后可以看到如下输出 (看到报错了请往上翻):

```bash
$ npm run lint

  1:1  error    Unexpected var, use let or const instead  no-var
  2:1  warning  Unexpected console statement              no-console

✖ 2 problems (1 error, 1 warning)
```

看说明大概可以了解， ESLint 检查出来两个错误: 一个是不应该使用 `var` 命令，对应 `no-var` 规则，另外一个是不应该在生产环境使用 
`console.log` 对应 `no-console` 规则。

这个时候可以使用 `npm run lint-fix` 自动修正错误，执行该命令后，我们可以看到 index.js 里的 `var x = 1` 被自动改成了 
`const x = 1` 。 ESLint 帮我们消除了一个错误，但第二个问题也无能为力。这个时候我们可以手动清除 `console.log` 或者如最开始提到
的那样，修改我们的检查规则，关闭 `no-console` 规则，只需要在 .eslintrc 文件的 `rules` 字段内添加以下配置即可:

```json
{
  "rules": {
    "no-console": "off"
  }
}
```

经过以上两步再执行 `npm run lint` 就不会报错了！

## ESLint 与 webpack

ESLint 有对应的 eslint-loader 因此我们可以通过在 webpack.config.js 内添加 `preLoaders` 设置，使 webpack 在打包编译前首选进行 
代码检查。**注意 webpack 2.1 以后已经没有 preLoaders 了，改使用 enforce 进行配置**

```javascript
module.exports = {
  // ...
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loaders: 'eslint-loader'
      }
    ],
    loaders: [
      // ...
    ]
  }
}

// webpack 2.1 以后
module.exports = {
  // ...
  module: {
    rules: [                        // rules 代替 loaders
      {
        enforce: 'pre',             // enforce 指定 pre | post 操作
        test: /\.jsx?$/,
        loaders: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      }
    ],
  },
}
```

接下来，我们还是安装好对应的依赖，然后把 lesson103 中的示例代码 (./src) 搬过来，体验一下将 ESLint 与 webpack 配合使用的效果。

1. 首选安装依赖

```bash
$ npm install --save react react-dom
$ npm install --save-dev babel-cli
$ npm install --save-dev babel-preset-es2015 babel-preset-react
$ npm install --save-dev webpack
$ npm install --save-dev babel-loader eslint-loader
```

2. 配置 [.babelrc](./.babelrc) 和 [.eslintrc](./.eslintrc)

3. 配置 [webpack](./webpack.config.js)

4. 打包编译

通过以上 1-3 的配置，实际上一个基本的 React 的前端开发框架就搭好了，从下一章开始，我们所有的项目都是在以上的配置基础上进行扩展和衍生
的，这里也会在下一章跟大家一起回顾一下到目前为止用到的依赖和各个工具的基本配置方法。执行 `npm run build` 我们可以看到打包还是执行完
成了，但是 index.jsx 里面有三个错误需要我们修复，有兴趣的伙伴可以尝试修复下这几个问题。 (由于之前的设置缩进都是 4 个字符，实际上我先
执行了 `eslint ./src/*.js* --fix` 自动修复了一些问题，所以大家看到的错误就仅剩下三个了。)

## 扩展阅读

1. [ESLint 中文官网](http://eslint.cn/docs/about/)

下一章: [完整的开发环境](../lesson105/README.md)
