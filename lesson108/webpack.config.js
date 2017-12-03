var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

const entry = process.env.ADV
  ? `src/advanced/${process.env.ADV}.jsx`
  : 'src/index.jsx';

module.exports = {
  entry: path.resolve(__dirname, entry),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  // devtool: 'eval-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loaders: 'eslint-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'src/advanced'),
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: 9000,
  },
  plugins: [
    new OpenBrowserPlugin({ url: 'http://localhost:9000' }),
  ],
}
