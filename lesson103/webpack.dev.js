var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: __dirname + '/dist',
        filename: './bundle.js',
        publicPath: '/dist',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                }
            }
        ]
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