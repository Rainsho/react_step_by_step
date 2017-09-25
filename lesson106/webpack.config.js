var path = require('path');

const entry = process.env.NODE_ENV === 'draft'
  ? 'src/draft/index.jsx'
  : 'src/index.jsx';

module.exports = {
  entry: path.resolve(__dirname, entry),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.jsx?$/,
      //   loaders: 'eslint-loader',
      //   include: path.resolve(__dirname, 'src'),
      // },
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
  }
}
