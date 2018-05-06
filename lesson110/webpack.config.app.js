var path = require('path');
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle_[hash:6].js',
    // publicPath: '/dist/',
  },
  // devtool: 'eval-source-map',
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
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DllReferencePlugin({ manifest: require('./dist/vendor_mainfest.json') }),
    new OpenBrowserPlugin({ url: 'http://localhost:9000' }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist', 'index.html'),
      template: path.resolve(__dirname, 'dist', 'index_vendor.html'),
    }),
  ],
};
