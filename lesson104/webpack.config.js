module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './dist/bundle.js',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loaders: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
}
