var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var vendor = [
  'lodash',
  'react',
  'react-dom',
  'react-intl',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
  'redux-logger',
  'redux-thunk',
  'uuid',
];

module.exports = {
  entry: { vendor },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[hash:6].js',
    library: '[name]',
    // publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(__dirname, 'dist', '[name]_mainfest.json'),
      // context: __dirname,
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist', 'index_vendor.html'),
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
};
